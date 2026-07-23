import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, //populate subcategories, subcategories[0] will be a type of "Category"
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });
    const formattedData = data.docs.map((parentDoc) => ({
      ...parentDoc,
      subcategories: (parentDoc.subcategories?.docs ?? []).filter((doc): doc is Category => typeof doc !== "string").map((doc) => ({
        // Because of "depth:1" we are confident "doc" will be a type of "Category"
        ...doc,
        subcategories: undefined,
      })),
    }));

    return formattedData;
  }),
});
