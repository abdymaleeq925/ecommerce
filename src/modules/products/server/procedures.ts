import z from "zod";

import { headers as getHeaders } from "next/headers";
import type { Sort, Where } from "payload";

import { DEFAULT_LIMIT } from "@/constants";
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { sortValues } from "../search-params";

const priceFilter = z.preprocess(
  (value) => (value === "" ? null : value == null ? value : Number(value)),
  z.number().finite().nonnegative().nullable().optional(),
);

export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string(),
        tenantSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });
      let product;
      try {
        product = await ctx.db.findByID({
          collection: "products",
          id: input.id,
          depth: 2,
        });
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      let isPurchased = false;
      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          pagination: false,
          limit: 1,
          where: {
            and: [
              { product: { equals: input.id } },
              { user: { equals: session.user.id } },
            ],
          },
        });
        isPurchased = !!ordersData.docs[0];
      }

      const productTenant = product.tenant as Tenant & { image: Media | null };
      const productTenantSlug =
        typeof product.tenant === "string" ? null : productTenant?.slug;

      if (productTenantSlug !== input.tenantSlug) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return {
        ...product,
        isPurchased,
        image: product.image as Media | null,
        tenant: productTenant as Tenant & { image: Media | null },
      };
    }),
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        minPrice: priceFilter,
        maxPrice: priceFilter,
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.sort === "curated") sort = "name";
      if (input.sort === "hot_and_new") sort = "-createdAt";
      if (input.sort === "old") sort = "createdAt";

      if (
        input.minPrice != null &&
        input.maxPrice != null &&
        input.minPrice > input.maxPrice
      ) {
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

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
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
            page: input.cursor,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
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
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 2, //populate "category", "tenant", "image" and "tenant.image"
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});
