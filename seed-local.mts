/**
 * seed-local.mts
 *
 * Bulk-load products into Payload CMS using Payload Local API.
 * Resolves category -> Categories relationship.
 * thumbnail/images are stored as plain URLs (served directly from S3/CloudFront,
 * not re-hosted into Payload's media collection).
 *
 * Usage:
 *   npx tsx seed-local.mts ./data/products_10000_s3.json --confirm-delete
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import configModule from "./src/payload.config";

const resolvedConfig = await ((configModule as any)?.default ?? configModule);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PRODUCTS_SLUG = "products";
const CATEGORIES_SLUG = "categories";

const BATCH_SIZE = 50;
const CONCURRENCY = 5;

const SEED_FAILURES_PATH = path.join(__dirname, "seed-failures.json");

type ProductRecord = {
  title: string;
  description?: string;
  category?: string;
  price?: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  images?: string[];
  thumbnail?: string;
};

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function saveJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

async function deleteAllDocs(payload: any, slug: string) {
  console.log(`Deleting all existing documents in "${slug}"...`);
  let totalDeleted = 0;

  while (true) {
    const { docs } = await payload.find({
      collection: slug,
      limit: 200,
      depth: 0,
    });

    if (docs.length === 0) break;

    const results = await Promise.allSettled(
      docs.map((doc: any) =>
        payload.delete({ collection: slug, id: doc.id })
      )
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    totalDeleted += succeeded;
    console.log(`  -> deleted ${totalDeleted} so far from "${slug}"`);

    if (succeeded === 0) {
      console.error(`Delete failed repeatedly on "${slug}". Stopping.`);
      break;
    }
  }

  console.log(`Done deleting ${totalDeleted} from "${slug}".\n`);
}

/**
 * Builds a map of categorySlug -> categoryDocId, creating any that don't exist.
 */
async function buildCategoryMap(
  payload: any,
  categorySlugs: Set<string>
): Promise<Map<string, string>> {
  console.log(`\nResolving ${categorySlugs.size} unique categories...`);
  const map = new Map<string, string>();

  for (const slug of categorySlugs) {
    const existing = await payload.find({
      collection: CATEGORIES_SLUG,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });

    if (existing.docs.length > 0) {
      map.set(slug, existing.docs[0].id);
      continue;
    }

    const created = await payload.create({
      collection: CATEGORIES_SLUG,
      data: {
        title: slugToTitle(slug),
        slug,
      },
    });

    map.set(slug, created.id);
    console.log(`  created category: ${slug} -> ${created.id}`);
  }

  console.log(`Category map ready (${map.size} entries).\n`);
  return map;
}

function toPayloadDoc(record: ProductRecord, categoryMap: Map<string, string>) {
  return {
    title: record.title,
    description: record.description,
    category: record.category ? categoryMap.get(record.category) : undefined,
    price: record.price,
    discountPercentage: record.discountPercentage,
    rating: record.rating,
    stock: record.stock,
    tags: record.tags,
    brand: record.brand,
    thumbnail: record.thumbnail,
    images: (record.images ?? []).map((url) => ({ url })),
  };
}

async function main() {
  const inputPath = process.argv[2];
  const confirmDelete = process.argv.includes("--confirm-delete");

  if (!inputPath) {
    console.error(
      "Usage: npx tsx seed-local.mts <products.json> [--confirm-delete]"
    );
    process.exit(1);
  }

  const records = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
  ) as ProductRecord[];

  console.log(`Loaded ${records.length} records from ${inputPath}`);

  const payload = await getPayload({ config: resolvedConfig });

  if (confirmDelete) {
    await deleteAllDocs(payload, PRODUCTS_SLUG);
    // Categories are left alone intentionally -- find-or-create by slug
    // makes this idempotent across reruns, not per-run data.
  } else {
    console.log(
      `Skipping delete step. Pass --confirm-delete to wipe "${PRODUCTS_SLUG}".\n`
    );
  }

  const categorySlugs = new Set(
    records.map((r) => r.category).filter((c): c is string => Boolean(c))
  );
  const categoryMap = await buildCategoryMap(payload, categorySlugs);

  let created = 0;
  let failed = 0;
  const failures: Array<{ sku?: string; error: string }> = [];

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);

    for (let j = 0; j < batch.length; j += CONCURRENCY) {
      const chunk = batch.slice(j, j + CONCURRENCY);

      const results = await Promise.allSettled(
        chunk.map((record) =>
          payload.create({
            collection: PRODUCTS_SLUG,
            data: toPayloadDoc(record, categoryMap),
          })
        )
      );

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          created++;
        } else {
          failed++;
          failures.push({
            sku: chunk[index].sku,
            error: result.reason?.message ?? String(result.reason),
          });
        }
      });
    }

    const processed = Math.min(i + BATCH_SIZE, records.length);
    if (processed % 500 === 0 || processed === records.length) {
      console.log(
        `Processed ${processed}/${records.length} | created: ${created} | failed: ${failed}`
      );
    }
  }

  if (failures.length > 0) {
    saveJson(SEED_FAILURES_PATH, failures);
    console.log(`\n${failures.length} failures written to ${SEED_FAILURES_PATH}`);
  }

  console.log(`\nDone. Created ${created}/${records.length} products.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
