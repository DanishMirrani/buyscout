"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCategories } from "@/services/payload";
import {
  Search,
  Sparkles,
  SprayCan,
  Sofa,
  ShoppingBasket,
  Palette,
  CookingPot,
  Monitor,
  Shirt,
  Footprints,
  Watch,
  SmartphoneNfc,
  Bike,
  Sparkle,
  MonitorSmartphone,
  Backpack,
  Sun,
  Tablet,
  Shirt as TopIcon,
  Car,
  BaggageClaim,
  Gem,
  Footprints as ShoeIcon,
  Eye,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  beauty: Sparkles,
  fragrances: SprayCan,
  furniture: Sofa,
  groceries: ShoppingBasket,
  "home-decoration": Palette,
  "kitchen-accessories": CookingPot,
  laptops: Monitor,
  "mens-shirts": Shirt,
  "mens-shoes": Footprints,
  "mens-watches": Watch,
  "mobile-accessories": SmartphoneNfc,
  motorcycle: Bike,
  "skin-care": Sparkle,
  smartphones: MonitorSmartphone,
  "sports-accessories": Backpack,
  sunglasses: Sun,
  tablets: Tablet,
  tops: TopIcon,
  vehicle: Car,
  "womens-bags": BaggageClaim,
  "womens-dresses": Gem,
  "womens-jewellery": Eye,
  "womens-shoes": ShoeIcon,
  "womens-watches": Watch,
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetchCategories();
        if (isMounted) {
          setCategories(response);
        }
      } catch {
        // silently fail
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = search.trim()
    ? categories.filter((cat) =>
        cat.toLowerCase().includes(search.trim().toLowerCase())
      )
    : categories;

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = search.trim();
    const params = new URLSearchParams();
    if (trimmed) {
      params.set("q", trimmed);
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <Container className="py-16 space-y-10">
      {/* Hero search area */}
      <section className="space-y-6">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All Categories
          </h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Browse every product category to find exactly what you need.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-border/70 bg-background/80 p-3 shadow-sm backdrop-blur sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="h-11 rounded-2xl pl-9"
                />
              </div>
              <Button className="h-11 shrink-0" type="submit">
                Search Products
              </Button>
            </div>
          </div>
        </form>
      </section>

      {/* Categories grid */}
      <section className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-border/70 bg-muted/40"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center text-sm text-muted-foreground">
            No categories match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((category) => {
              const slug = slugify(category);
              const Icon = CATEGORY_ICONS[slug] ?? Sparkles;
              return (
                <Link
                  key={category}
                  href={`/category/${encodeURIComponent(slug)}`}
                  className="group flex flex-col items-center rounded-2xl border border-border/70 bg-background p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-xl border border-border/60 bg-muted/50 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                    <Icon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="text-base font-semibold capitalize group-hover:text-primary">
                    {category}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 h-8 text-xs"
                    asChild
                  >
                    <span>Browse →</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </Container>
  );
}