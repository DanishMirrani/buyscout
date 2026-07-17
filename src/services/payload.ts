const getApiUrl = () => {
  if (typeof window !== "undefined") {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!isLocalhost && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    return "";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

interface PayloadProduct {
  id: number;
  title: string;
  description: string | null;
  price: number;
  discountPercentage: number | null;
  rating: number | null;
  stock: number | null;
  brand: string | null;
  category: { id: number; title: string; slug: string } | number | null;
  thumbnail: string | null;
  images?: { url: string }[] | null;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface PayloadCategory {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number | null;
}

interface PayloadProductsResponse {
  docs: PayloadProduct[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

interface PayloadCategoriesResponse {
  docs: PayloadCategory[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const API_URL = getApiUrl();
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

function normalizeProduct(p: PayloadProduct): Product {
  const categoryTitle =
    p.category && typeof p.category === "object"
      ? p.category.title
      : typeof p.category === "number"
        ? String(p.category)
        : "Uncategorized";

  const thumbnailUrl = p.thumbnail || "/placeholder.svg";

  const images: string[] = [];
  if (p.images && Array.isArray(p.images)) {
    for (const img of p.images) {
      if (img?.url) {
        images.push(img.url);
      }
    }
  }
  if (images.length === 0 && thumbnailUrl !== "/placeholder.svg") {
    images.push(thumbnailUrl);
  }

  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    price: p.price,
    discountPercentage: p.discountPercentage ?? 0,
    rating: p.rating ?? 0,
    stock: p.stock ?? 0,
    brand: p.brand ?? "",
    category: categoryTitle,
    thumbnail: thumbnailUrl,
    images,
  };
}

export async function fetchProductsForQuery(
  query: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  const trimmedQuery = query.trim();
  const searchParams = new URLSearchParams({
    limit: "20",
    sort: "-createdAt",
  });

  if (trimmedQuery) {
    searchParams.set("where[title][like]", trimmedQuery);
  }

  const data = await fetchAPI<PayloadProductsResponse>(
    `/api/products?${searchParams.toString()}`,
    { signal },
  );

  return (data.docs ?? []).map(normalizeProduct);
}

export async function fetchProductsByCategory(
  category: string,
  signal?: AbortSignal,
): Promise<Product[]> {
  const searchParams = new URLSearchParams({
    limit: "20",
    sort: "-createdAt",
  });
  searchParams.set("where[category.slug][equals]", category);

  const data = await fetchAPI<PayloadProductsResponse>(
    `/api/products?${searchParams.toString()}`,
    { signal },
  );

  return (data.docs ?? []).map(normalizeProduct);
}

export async function fetchProductById(
  productId: string | number,
  signal?: AbortSignal,
): Promise<Product | null> {
  try {
    const data = await fetchAPI<PayloadProduct>(
      `/api/products/${productId}`,
      { signal },
    );

    return data ? normalizeProduct(data) : null;
  } catch {
    return null;
  }
}

export async function fetchCategories(
  signal?: AbortSignal,
): Promise<string[]> {
  const searchParams = new URLSearchParams({
    limit: "100",
    sort: "order",
  });

  const data = await fetchAPI<PayloadCategoriesResponse>(
    `/api/categories?${searchParams.toString()}`,
    { signal },
  );

  return (data.docs ?? []).map((cat) => cat.title);
}

export async function fetchCategoriesWithSlugs(
  signal?: AbortSignal,
): Promise<{ title: string; slug: string; icon: string | null }[]> {
  const searchParams = new URLSearchParams({
    limit: "100",
    sort: "order",
  });

  const data = await fetchAPI<PayloadCategoriesResponse>(
    `/api/categories?${searchParams.toString()}`,
    { signal },
  );

  return (data.docs ?? []).map((cat) => ({
    title: cat.title,
    slug: cat.slug,
    icon: cat.icon,
  }));
}