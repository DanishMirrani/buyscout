"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { fetchProductsByCategory, type Product } from "@/services/dummyjson";
import { ArrowRight } from "lucide-react";

interface CategoryPageProps {
  category: string;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchProductsByCategory(category, controller.signal);

        if (!controller.signal.aborted) {
          setProducts(response);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("We couldn't load products for this category.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [category]);

  const displayCategory = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Container className="py-16">
      <section className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold capitalize">{displayCategory}</h1>
          <p className="text-sm text-muted-foreground">
            Browse all products in {displayCategory.toLowerCase()}.
          </p>
        </div>

        {error ? (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-2xl border border-border/70 bg-muted/40"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
            No products found in this category.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="rounded-2xl border border-border/70 bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
                    <h2 className="mt-1 text-lg font-semibold">{product.title}</h2>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-sm font-medium">
                    ${product.price}
                  </span>
                </div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border/70">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={800}
                    height={480}
                    className="h-40 w-full object-cover"
                  />
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>{product.brand}</span>
                  <span className="flex items-center gap-2 font-medium text-foreground">
                    View <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}