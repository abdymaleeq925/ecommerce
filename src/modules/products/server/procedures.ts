import z from "zod";

import type { Where } from "payload";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
  .input(
    z.object({
      category: z.string().nullable().optional(),
      page: z.number().default(1),
      limit: z.number().default(12)
    })
  )
  .query(async ({ ctx, input }) => {
    const where: Where = {};
    if(input.category) {
      const categoriesData = await ctx.db.find({
        collection: "categories",
        limit: 1,
        depth: 1, // Populate subcategories, subcategories[0] will be a type of "Category"
        pagination: false,
        where: {
          slug: {
            equals: input.category 
          }
        }
      });

      const parentCategory = categoriesData.docs[0];

      if(!parentCategory) {
        return {
          docs: [],
          totalDocs: 0,
          limit: input.limit,
          page: input.page,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
        
      } 

      const subcategoriesSlugs: string[] = (parentCategory.subcategories?.docs ?? []).filter((doc): doc is Category => typeof doc !== "string").map((doc) => doc.slug);

      where["category.slug"] = {
        in: [parentCategory.slug, ...subcategoriesSlugs]
      }
    }
    const data = await ctx.db.find({
      collection: "products",
      depth: 1, //populate "category" and "image"
      where,
      page: input.page,
      limit: input.limit
    });

    return data;
  }),
});
