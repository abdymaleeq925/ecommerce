import z from "zod";

import type { Sort, Where } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import { sortValues } from "../search-params";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        page: z.number().default(1),
        limit: z.number().default(12),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional()
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if(input.sort === "curated") sort = "name"
      if(input.sort === "hot_and_new") sort = "-createdAt"
      if(input.sort === "old") sort = "createdAt"

      if (input.minPrice != null && input.maxPrice != null && input.minPrice > input.maxPrice) {
        [input.minPrice, input.maxPrice] = [input.maxPrice, input.minPrice];
      }
      if (input.minPrice != null && input.maxPrice != null) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice != null) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice != null) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1, // Populate subcategories, subcategories[0] will be a type of "Category"
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        const parentCategory = categoriesData.docs[0];

        if (!parentCategory) {
          return {
            docs: [],
            totalDocs: 0,
            limit: input.limit,
            page: input.page,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          };
        }

        const subcategoriesSlugs: string[] = (
          parentCategory.subcategories?.docs ?? []
        )
          .filter((doc): doc is Category => typeof doc !== "string")
          .map((doc) => doc.slug);

        where["category.slug"] = {
          in: [parentCategory.slug, ...subcategoriesSlugs],
        };
      }
      if(input.tags && input.tags.length >0) {
        where["tags.name"] = {
          in: input.tags
        }
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 1, //populate "category" and "image"
        where,
        page: input.page,
        limit: input.limit,
        sort
      });

      return data;
    }),
});
