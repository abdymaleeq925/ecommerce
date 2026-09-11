import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { user: { equals: req.user.id } } : false;
    },
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
