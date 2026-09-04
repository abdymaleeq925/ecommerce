import { isSuperAdmin } from "@/isSuperAdmin";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { createdBy: { equals: req.user.id } } : false;
    },
    delete: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { createdBy: { equals: req.user.id } } : false;
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data, operation }) => {
        if (operation === "create" && req.user) {
          data.createdBy = req.user?.id;
        }
        return data;
      },
    ],
  },
  upload: true,
};
