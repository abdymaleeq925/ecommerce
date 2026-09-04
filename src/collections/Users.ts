import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

import { isSuperAdmin } from "@/isSuperAdmin";

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: isSuperAdmin,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
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
    create: () => true,
    update: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { id: { equals: req.user.id } } : false;
    },
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: "email",
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
