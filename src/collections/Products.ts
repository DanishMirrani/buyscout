import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "price", "brand", "rating"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "discountPercentage",
      type: "number",
      min: 0,
      max: 100,
      defaultValue: 0,
    },
    {
      name: "rating",
      type: "number",
      min: 0,
      max: 5,
      defaultValue: 0,
    },
    {
      name: "stock",
      type: "number",
      min: 0,
      defaultValue: 0,
    },
    {
      name: "brand",
      type: "text",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      index: true,
    },
    {
      name: "thumbnail",
      type: "text",
    },
    {
      name: "images",
      type: "array",
      fields: [
        {
          name: "url",
          type: "text",
        },
      ],
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
    },
  ],
};