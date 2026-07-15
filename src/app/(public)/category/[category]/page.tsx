import { CategoryPage } from "@/features/categories/category-page";
import type { Metadata } from "next";

interface CategoryRouteProps {
  params: Promise<{
    category: string;
  }>;
}

// ISR: revalidate every 24 hours
export const revalidate = 86400;

// Dynamic metadata per category for SEO
export async function generateMetadata({ params }: CategoryRouteProps): Promise<Metadata> {
  const { category } = await params;
  const displayName = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${displayName} Products`,
    description: `Browse all products in the ${displayName.toLowerCase()} category.`,
  };
}

export default async function CategoryRoute({ params }: CategoryRouteProps) {
  const { category } = await params;

  return <CategoryPage category={category} />;
}