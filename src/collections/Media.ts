import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    delete: isSuperAdmin,
  },
  admin: {
    hidden: ({ user }) => !user?.roles?.includes("super-admin"),
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
