"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { fetchProductById, type Product } from "@/services/payload";
import { ArrowLeft } from "lucide-react";

interface ProductPageProps {
  productId: string;
}

export function ProductPage({ productId }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching product by ID from API...", `${productId}`);
        const response = await fetchProductById(productId, controller.signal);
        if (!controller.signal.aborted) {
          setProduct(response);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("We couldn’t load this product right now.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [productId]);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="h-48 animate-pulse rounded-2xl border border-border/70 bg-muted/40" />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-16">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{error ?? "Product not found."}</p>
          <Button asChild variant="outline">
            <Link href="/search">
              <ArrowLeft className="mr-2 size-4" />
              Back to search
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="space-y-6">
        <Button asChild variant="outline">
          <Link href="/search">
            <ArrowLeft className="mr-2 size-4" />
            Back to search
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-background p-3">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={1200}
              height={900}
              className="h-[420px] w-full rounded-2xl object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {product.category}
              </p>
              <h1 className="text-3xl font-semibold">{product.title}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price</span>
                <span className="text-xl font-semibold">${product.price}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rating</span>
                <span className="font-medium">⭐ {product.rating}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stock</span>
                <span className="font-medium">{product.stock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
