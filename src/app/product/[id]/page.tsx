import { ProductPage } from "@/features/products";
import { fetchProductById, fetchProductsForQuery } from "@/services/dummyjson";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// ISR: revalidate every 24 hours
export const revalidate = 86400;

// Pre-render the first 20 products at build time (SSG)
export async function generateStaticParams() {
  const products = await fetchProductsForQuery("");

  return products.slice(0, 20).map((product) => ({
    id: String(product.id),
  }));
}

// Dynamic metadata per product for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.thumbnail }],
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { id } = await params;
  return <ProductPage productId={id} />;
}