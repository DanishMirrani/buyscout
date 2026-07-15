import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Lucide icon name for this category (e.g. 'Sparkles', 'Sofa')",
      },
    },
    {
      name: "order",
      type: "number",
      admin: {
        description: "Display order for sorting categories",
      },
    },
  ],
};