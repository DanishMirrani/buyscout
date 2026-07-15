import { CategoriesPage } from "@/features/categories/categories-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all product categories to find exactly what you're looking for.",
};

export default function CategoriesRoute() {
  return <CategoriesPage />;
}