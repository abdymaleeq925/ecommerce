import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Categories: CollectionConfig = {
  slug: "categories",
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
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
    },
  ],
};
