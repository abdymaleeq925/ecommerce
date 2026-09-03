import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/isSuperAdmin";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  admin: { useAsTitle: "description" },
  fields: [
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      hasMany: false,
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
  ],
};
