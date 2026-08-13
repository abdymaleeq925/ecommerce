import type { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
    slug: "products",
    admin: {
        useAsTitle: "name"
    },
    access: {
        read: () => true, // каталог товаров публичный — читать может кто угодно
        create: ({ req }) => Boolean(req.user), // создавать может только авторизованный пользователь
        update: ({ req }) => {
            if(!req.user) return false
            return true
        },
        delete: ({ req }) => Boolean(req.user),
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