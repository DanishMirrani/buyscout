const BASE_URL = "https://dummyjson.com";

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

interface ProductsResponse {
  products: Product[];
  total?: number;
  skip?: number;
  limit?: number;
}

interface CategoryItem {
  slug?: string;
  name?: string;
  url?: string;
}

let categoriesCache: { data: string[]; expiresAt: number } | null = null;
const CATEGORY_CACHE_TTL = 10 * 60 * 1000;

export async function fetchProductsForQuery(
  query: string,
  signal?: AbortSignal
): Promise<Product[]> {
  const trimmedQuery = query.trim();
  const endpoint = trimmedQuery
    ? `/products/search?q=${encodeURIComponent(trimmedQuery)}`
    : "/products?limit=20";

  const response = await fetch(`${BASE_URL}${endpoint}`, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = (await response.json()) as ProductsResponse;

  return Array.isArray(data.products) ? data.products : [];
}

export async function fetchProductsByCategory(
  category: string,
  signal?: AbortSignal
): Promise<Product[]> {
  const response = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products by category");
  }

  const data = (await response.json()) as ProductsResponse;

  return Array.isArray(data.products) ? data.products : [];
}

export async function fetchProductById(
  productId: string | number,
  signal?: AbortSignal
): Promise<Product | null> {
    console.log("Fetching product by ID from API...", `${BASE_URL}/products/${productId}`);
  const response = await fetch(`${BASE_URL}/products/${productId}`, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = (await response.json()) as Product;
  return data ?? null;
}

export async function fetchCategories(
  signal?: AbortSignal
): Promise<string[]> {
  const now = Date.now();

  if (categoriesCache && categoriesCache.expiresAt > now) {
    return categoriesCache.data;
  }

  if (categoriesCache && categoriesCache.expiresAt <= now) {
    const staleData = categoriesCache.data;
    void fetchCategoriesFresh(signal);
    return staleData;
  }

  return fetchCategoriesFresh(signal);
}

async function fetchCategoriesFresh(
  signal?: AbortSignal
): Promise<string[]> {
  console.log("Fetching categories from API...", `${BASE_URL}/products/categories`);
  const response = await fetch(`${BASE_URL}/products/categories`, { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = (await response.json()) as Array<string | CategoryItem>;

  const normalized = Array.isArray(data)
    ? data.map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return item.name ?? item.slug ?? "uncategorized";
      })
    : [];

  categoriesCache = {
    data: normalized,
    expiresAt: Date.now() + CATEGORY_CACHE_TTL,
  };

  return normalized;
}
