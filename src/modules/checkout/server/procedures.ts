import z from "zod";
import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Media, Tenant } from "@/payload-types";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
        tenantSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      
      const data = await ctx.db.find({
        collection: "products",
        depth: 2,
        overrideAccess: false,
        limit: input.ids.length,
        where: {
          id: {
            in: input.ids
          },
          ["tenant.slug"]: {
            equals: input.tenantSlug,
          },
        }
      });

      if(data.totalDocs !== input.ids.length) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" })
      }

      const docs = data.docs.map((doc) => ({
        ...doc,
        image: doc.image as Media | null,
        tenant: doc.tenant as Tenant & { image: Media | null },
      }));

      const hasForeignTenant = docs.some((doc) => doc.tenant?.slug !== input.tenantSlug);
      if (hasForeignTenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
      }

      const totalPrice = data.docs.reduce((acc, product) => {
        const price = Number(product.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0)

      return {
        ...data,
        totalPrice,
        docs
      };
    }),
});
