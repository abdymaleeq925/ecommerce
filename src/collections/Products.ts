import { isSuperAdmin } from '@/isSuperAdmin';
import { User } from '@/payload-types';
import type { CollectionConfig } from 'payload';

const getUserTenantIds = (user: User | null | undefined): string[] => {
    if (!user?.tenants) return [];
    return user.tenants
      .map((entry) => (typeof entry.tenant === "string" ? entry.tenant : entry.tenant?.id))
      .filter((id): id is string => Boolean(id));
  };

export const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "name"
    },
    access: {
        read: () => true,
        create: ({ req }) => {
            if (isSuperAdmin({ req })) return true;
            return getUserTenantIds(req.user).length > 0;
          },
          update: ({ req }) => {
            if (isSuperAdmin({ req })) return true;
            const tenantIds = getUserTenantIds(req.user);
            if (tenantIds.length === 0) return false;
            return { tenant: { in: tenantIds } };
          },
          delete: ({ req }) => {
            if (isSuperAdmin({ req })) return true;
            const tenantIds = getUserTenantIds(req.user);
            if (tenantIds.length === 0) return false;
            return { tenant: { in: tenantIds } };
          }
      },
    fields: [
        {
            name: "name",
            type: "text",
            required: true
        },
        {
            name: "description",
            type: "text"
        },
        {
            name: "price",
            type: "number",
            required: true,
            min: 0,
            admin: {
                description: "Price in USD"
            }
        },
        {
            name: "category",
            type: "relationship",
            relationTo: "categories",
            hasMany: false
        },
        {
            name: "tags",
            type: "relationship",
            relationTo: "tags",
            hasMany: true
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "refundPolicy",
            type: "select",
            options: ["30-days", "14-days", "7-days", "3-days", "1-day", "no-refunds"],
            defaultValue: "30-days"
        }
    ]
}