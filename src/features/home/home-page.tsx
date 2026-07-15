"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    autoUpdate,
    flip,
    FloatingFocusManager,
    offset,
    shift,
    size,
    useDismiss,
    useFloating,
    useInteractions,
    useListNavigation,
    useRole,
} from "@floating-ui/react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchCategories, fetchProductsForQuery, type Product } from "@/services/payload";
import { ArrowRight, Search, Sparkles, SprayCan, Sofa, ShoppingBasket, Palette, CookingPot } from "lucide-react";

export function HomePage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const router = useRouter();

    const listRef = useRef<Array<HTMLElement | null>>([]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 300);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        let isMounted = true;

        async function loadCategories() {
            try {
                const response = await fetchCategories();
                if (isMounted) {
                    setCategories(response);
                }
            } catch {
                if (isMounted) {
                    setError("We couldn’t load categories right now.");
                }
            }
        }

        void loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const query = debouncedSearch;

        if (!query) {
            return () => controller.abort();
        }

        async function loadProducts() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchProductsForQuery(query, controller.signal);
                if (!controller.signal.aborted) {
                    setProducts(response.slice(0, 6));
                }
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setError("We couldn’t load suggestions right now.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void loadProducts();

        return () => controller.abort();
    }, [debouncedSearch]);

    const FEATURED_CATEGORIES = [
        { slug: "beauty", name: "Beauty", subtitle: "Skincare & makeup", icon: Sparkles },
        { slug: "fragrances", name: "Fragrances", subtitle: "Perfumes & colognes", icon: SprayCan },
        { slug: "furniture", name: "Furniture", subtitle: "Home & office", icon: Sofa },
        { slug: "groceries", name: "Groceries", subtitle: "Food & essentials", icon: ShoppingBasket },
        { slug: "home-decoration", name: "Home Decoration", subtitle: "Decor & accents", icon: Palette },
        { slug: "kitchen-accessories", name: "Kitchen Accessories", subtitle: "Cookware & tools", icon: CookingPot },
    ];

    const filteredCategories = useMemo(() => {
        const query = debouncedSearch.toLowerCase();
        if (!query) {
            return [];
        }

        return categories
            .filter((category) => category.toLowerCase().includes(query))
            .slice(0, 6);
    }, [categories, debouncedSearch]);

    const visibleProducts = debouncedSearch ? products : [];
    const hasSuggestions = debouncedSearch.length > 0;
    const hasContent = filteredCategories.length > 0 || visibleProducts.length > 0;
    const showFloating = open && debouncedSearch.length > 0;

    // Build a flat list of all suggestion items for list navigation
    const suggestionItems = useMemo(() => {
        const items: Array<{ type: "category" | "product" | "empty" | "loading" | "error"; data: string | Product }> = [];

        if (error) {
            items.push({ type: "error", data: error });
            return items;
        }

        if (loading && products.length === 0 && filteredCategories.length === 0) {
            items.push({ type: "loading", data: "Loading..." });
            return items;
        }

        if (!hasContent) {
            items.push({ type: "empty", data: "No matching suggestions yet." });
            return items;
        }

        // Add a group label for categories
        if (filteredCategories.length > 0) {
            for (const cat of filteredCategories) {
                items.push({ type: "category", data: cat });
            }
        }

        if (visibleProducts.length > 0) {
            for (const prod of visibleProducts) {
                items.push({ type: "product", data: prod });
            }
        }

        return items;
    }, [error, loading, filteredCategories, visibleProducts, hasContent]);

    const { refs, floatingStyles, context } = useFloating({
        open: showFloating,
        onOpenChange: setOpen,
        placement: "bottom-start",
        middleware: [
            offset(8),
            flip({ padding: 8 }),
            shift({ padding: 8 }),
            size({
                apply({ availableHeight, elements }) {
                    Object.assign(elements.floating.style, {
                        maxHeight: `${Math.min(availableHeight, 400)}px`,
                    });
                },
                padding: 8,
            }),
        ],
        whileElementsMounted: autoUpdate,
    });

    const role = useRole(context, { role: "listbox" });
    const dismiss = useDismiss(context, { outsidePress: true });
    const listNav = useListNavigation(context, {
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: true,
        loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([role, dismiss, listNav]);

    function handleSearchSubmit(event?: FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        const trimmed = search.trim();
        const params = new URLSearchParams();

        if (trimmed) {
            params.set("q", trimmed);
        }

        setOpen(false);
        router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
    }

    function handleCategorySelect(category: string) {
        setOpen(false);
        router.push(`/category/${encodeURIComponent(category)}`);
    }

    function handleProductSelect(id: number) {
        setOpen(false);
        router.push(`/product/${id}`);
    }

    function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            event.preventDefault();

            // If there's an active list item, select it
            if (activeIndex !== null && suggestionItems[activeIndex]) {
                const item = suggestionItems[activeIndex];
                if (item.type === "category") {
                    handleCategorySelect(item.data as string);
                } else if (item.type === "product") {
                    handleProductSelect((item.data as Product).id);
                }
                return;
            }

            handleSearchSubmit();
        }

        if (event.key === "Escape") {
            setOpen(false);
        }
    }

    function handleInputFocus() {
        if (debouncedSearch.length > 0) {
            setOpen(true);
        }
    }

    function handleInputChange(value: string) {
        setSearch(value);
        if (value.trim().length > 0) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }

    return (
        <Container className="py-16 space-y-24">
            <section className="mt-16 mb-32">
                <div className="py-4 space-y-6 text-center">
                    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary">
                        <Sparkles className="size-4" />
                        Smart product discovery
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Find the right product faster
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Search categories and products instantly, then jump into the full results experience.
                    </p>
                </div>

                <form onSubmit={handleSearchSubmit} className="rounded-3xl border border-border/70 bg-background/80 p-4 shadow-sm backdrop-blur sm:p-6">
                    <div ref={refs.setReference} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(event) => handleInputChange(event.target.value)}
                                onKeyDown={handleInputKeyDown}
                                onFocus={handleInputFocus}
                                placeholder="Search products, brands, or categories"
                                className="h-11 rounded-2xl pl-9"
                                role="combobox"
                                aria-expanded={showFloating}
                                aria-autocomplete="list"
                                aria-controls="search-suggestions"
                                {...getReferenceProps()}
                            />
                        </div>
                        <Button className="h-11" type="submit">Search</Button>
                    </div>

                    {showFloating && (
                        <FloatingFocusManager context={context} initialFocus={-1} visuallyHiddenDismiss>
                            <div
                                ref={refs.setFloating}
                                id="search-suggestions"
                                style={floatingStyles}
                                className="z-50 w-[calc(100%-2rem)] rounded-2xl border border-border/70 bg-background p-4 shadow-lg backdrop-blur sm:w-[calc(100%-3rem)] overflow-y-auto"
                                role="listbox"
                                {...getFloatingProps()}
                            >
                                {error ? (
                                    <p className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                                        {error}
                                    </p>
                                ) : loading && products.length === 0 && filteredCategories.length === 0 ? (
                                    <div className="flex items-center justify-center py-6">
                                        <div className="size-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                                    </div>
                                ) : hasContent ? (
                                    <div className="space-y-4">
                                        {filteredCategories.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="px-1 text-sm font-medium text-muted-foreground">Categories</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {filteredCategories.map((category, i) => (
                                                        <Button
                                                            key={category}
                                                            ref={(node) => {
                                                                listRef.current[i] = node;
                                                            }}
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            role="option"
                                                            aria-selected={activeIndex === i}
                                                            tabIndex={-1}
                                                            onClick={() => handleCategorySelect(category)}
                                                            {...getItemProps()}
                                                        >
                                                            {category}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {filteredCategories.length > 0 && visibleProducts.length > 0 && (
                                            <div className="h-px w-full bg-border" />
                                        )}

                                        {visibleProducts.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="px-1 text-sm font-medium text-muted-foreground">Products</p>
                                                <div className="space-y-2">
                                                    {visibleProducts.map((product, i) => {
                                                        const itemIndex = filteredCategories.length + i;
                                                        return (
                                                            <div
                                                                key={product.id}
                                                                ref={(node) => {
                                                                    listRef.current[itemIndex] = node;
                                                                }}
                                                                role="option"
                                                                aria-selected={activeIndex === itemIndex}
                                                                tabIndex={-1}
                                                                className="flex cursor-pointer items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
                                                                onClick={() => handleProductSelect(product.id)}
                                                                {...getItemProps()}
                                                            >
                                                                <div>
                                                                    <p className="text-sm font-medium">{product.title}</p>
                                                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <span>${product.price}</span>
                                                                    <ArrowRight className="size-4" />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
                                        No matching suggestions yet.
                                    </div>
                                )}
                            </div>
                        </FloatingFocusManager>
                    )}
                </form>
            </section>


            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Featured Categories</h2>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/categories">View all →</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                    {FEATURED_CATEGORIES.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link
                                key={category.slug}
                                href={`/category/${encodeURIComponent(category.slug)}`}
                                className="group flex flex-col items-center rounded-2xl border border-border/70 bg-background p-6 text-center transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm"
                            >
                                <div className="mb-4 flex size-14 items-center justify-center rounded-xl border border-border/60 bg-muted/50 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                                    <Icon className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
                                </div>
                                <p className="text-base font-semibold capitalize group-hover:text-primary">
                                    {category.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">{category.subtitle}</p>
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
            </section>

            <section className="space-y-6 pt-4">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="mx-auto max-w-xl text-muted-foreground">
                        Everything you need to know about BuyScout and how it works.
                    </p>
                </div>
                <Accordion type="single" collapsible className="mx-auto max-w-7xl">
                    <AccordionItem value="what-is">
                        <AccordionTrigger>What is BuyScout?</AccordionTrigger>
                        <AccordionContent>
                            BuyScout is a product discovery and recommendation platform that helps you find, compare, and evaluate products through curated guides, comparisons, reviews, and recommendations before you buy.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="does-sell">
                        <AccordionTrigger>Does BuyScout sell products?</AccordionTrigger>
                        <AccordionContent>
                            No. BuyScout doesn't sell products directly. When you're ready to purchase, we'll redirect you to trusted online retailers where you can complete your order.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="how-ranked">
                        <AccordionTrigger>How are products selected and ranked?</AccordionTrigger>
                        <AccordionContent>
                            Our recommendations are based on research, product specifications, user feedback, expert analysis, and value for money. We aim to provide helpful, unbiased recommendations that make choosing easier.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="which-stores">
                        <AccordionTrigger>Which stores does BuyScout link to?</AccordionTrigger>
                        <AccordionContent>
                            We link to trusted online retailers and official brand stores, including marketplaces such as Amazon, Shopify-powered stores, Daraz, and other reputable sellers, depending on product availability and region.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="free">
                        <AccordionTrigger>Is BuyScout free to use?</AccordionTrigger>
                        <AccordionContent>
                            Yes. BuyScout is completely free to use. You can search, compare, and explore products without creating an account or paying any fees.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="makes-money">
                        <AccordionTrigger>How does BuyScout make money?</AccordionTrigger>
                        <AccordionContent>
                            Some links on BuyScout are affiliate links. If you purchase through one of these links, we may earn a small commission at no extra cost to you. This helps us keep the platform free while maintaining our editorial independence.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>

            <section className="space-y-8">
                <div className="space-y-4 text-center rounded-3xl border border-border/70 bg-background/80 p-8 sm:p-12 shadow-sm backdrop-blur">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Ready to find the right product?
                    </h2>
                    <p className="mx-auto max-w-lg text-muted-foreground">
                        Explore expert recommendations, compare options, and discover products that match your needs before you buy.
                    </p>
                    <Button
                        size="lg"
                        className="mt-2"
                        onClick={() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                    >
                        Start Searching
                    </Button>
                </div>
            </section>
        </Container>
    );
}
