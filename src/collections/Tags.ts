import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Tags: CollectionConfig = {
  slug: "tags",
  access: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: "name",
    hidden: ({ user }) => !user?.roles?.includes("super-admin"),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    // {
    // 	name: "products",
    // 	type: "relationship",
    // 	relationTo: "products",
    // 	hasMany: true
    // }
  ],
};
