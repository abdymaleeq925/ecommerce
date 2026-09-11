import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import type { CollectionConfig } from "payload";

import { isSuperAdmin } from "@/lib/access";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
  },
  tenantFieldAccess: {
    read: () => true,
    create: isSuperAdmin,
    update: isSuperAdmin,
  },
});

export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    create: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    delete: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    update: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
  },
  admin: {
    useAsTitle: "email",
    hidden: ({ user }) => !user?.roles?.includes("super-admin"),
  },
  auth: true,
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text",
    },
    {
      admin: {
        position: "sidebar",
      },
      name: "roles",
      type: "select",
      defaultValue: ["user"],
      hasMany: true,
      options: ["super-admin", "user"],
      access: {
        update: isSuperAdmin,
      },
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: "sidebar",
      },
    },
  ],
};
