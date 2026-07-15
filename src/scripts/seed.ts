import { getPayload } from "payload";
import config from "@payload-config";

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding database...");

  // Create admin user
  const existingAdmin = await payload.find({
    collection: "users",
    where: { email: { equals: "admin@example.com" } },
  });

  if (existingAdmin.docs.length === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@example.com",
        password: "password123",
        name: "Admin User",
      },
    });
    console.log("  Created admin user: admin@example.com");
  } else {
    console.log("  Admin user already exists");
  }

  // Fetch categories from dummyjson
  const catResponse = await fetch("https://dummyjson.com/products/categories");
  const categoriesData = (await catResponse.json()) as Array<
    string | { slug: string; name: string; url: string }
  >;

  const categorySlugs: string[] = [];

  for (const item of categoriesData) {
    const slug =
      typeof item === "string"
        ? item.toLowerCase().replace(/\s+/g, "-")
        : item.slug;
    const name =
      typeof item === "string" ? item : item.name || item.slug;

    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "categories",
        data: {
          title: name,
          slug,
        },
      });
      console.log(`  Created category: ${name}`);
    }

    categorySlugs.push(slug);
  }

  // Fetch products from dummyjson
  const prodResponse = await fetch("https://dummyjson.com/products?limit=100");
  const productsData = (await prodResponse.json()) as {
    products: Array<{
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
    }>;
  };

  for (const product of productsData.products) {
    const catSlug = product.category.toLowerCase().replace(/\s+/g, "-");

    // Find the category
    const catResult = await payload.find({
      collection: "categories",
      where: { slug: { equals: catSlug } },
    });

    const categoryId = catResult.docs[0]?.id;

    const existing = await payload.find({
      collection: "products",
      where: { title: { equals: product.title } },
    });

    if (existing.docs.length === 0) {
      await payload.create({
        collection: "products",
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          discountPercentage: product.discountPercentage,
          rating: product.rating,
          stock: product.stock,
          brand: product.brand || "",
          category: categoryId as number,
          tags: [product.category],
        },
      });
      console.log(`  Created product: ${product.title}`);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});