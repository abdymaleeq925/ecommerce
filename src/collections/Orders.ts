import { isSuperAdmin } from "@/isSuperAdmin";
import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
	access: {
    read: ({ req }) => {
      if (isSuperAdmin({ req })) return true;
      return req.user ? { user: { equals: req.user.id } } : false;
    },
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
		{
			name: "name",
			type: "text",
			required: true
		},
		{
			name: "user",
			type: "relationship",
			relationTo: "users",
			required: true,
			hasMany: false
		},
		{ 
			name: "product",
			type: "relationship",
			relationTo: "products",
			required: true,
			hasMany: false
		},
		{
			name: "stripeCheckoutSessionId",
			type: "text",
			required: true
		}
	],
};
