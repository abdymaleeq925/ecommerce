import type { CollectionConfig } from 'payload';

import { isSuperAdmin } from '@/isSuperAdmin';

export const Categories: CollectionConfig = {
    slug: "categories",
    access: {
        read: () => true,
        create: isSuperAdmin,
        update: isSuperAdmin,
        delete: isSuperAdmin,
    },
    admin: {
        useAsTitle: "name"
    },
    fields: [
        {
            name: "name",
            type: "text",
            required: true
        },
        {
            name: "slug",
            type: "text",
            required: true,
            unique: true,
            index: true
        },
        {
            name: "color",
            type: "text"
        },
        {
             name: "parent",
             type: "relationship",
             relationTo: "categories",
             hasMany: false
        },
        {
            name: "subcategories",
            type: "join",
            collection: "categories",
            on: "parent",
            hasMany: true
        }
    ]
}