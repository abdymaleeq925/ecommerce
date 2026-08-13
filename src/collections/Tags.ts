import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/isSuperAdmin'

export const Tags: CollectionConfig = {
  slug: 'tags',
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
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    // {
		// 	name: "products",
		// 	type: "relationship",
		// 	relationTo: "products",
		// 	hasMany: true
    // }
  ]
}
