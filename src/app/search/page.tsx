import { SearchPage } from "@/features/search/search-page";
import type { Metadata } from "next";

interface SearchRouteProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

// Dynamic metadata for search queries
export async function generateMetadata({ searchParams }: SearchRouteProps): Promise<Metadata> {
  const { q } = await searchParams;

  if (q?.trim()) {
    return {
      title: `Search results for "${q.trim()}"`,
      description: `Browse products matching "${q.trim()}".`,
    };
  }

  return {
    title: "Search Products",
    description: "Search products, brands, or categories.",
  };
}

export default async function SearchRoute({ searchParams }: SearchRouteProps) {
  const { q = "" } = await searchParams;

  return <SearchPage searchQuery={q} />;
}