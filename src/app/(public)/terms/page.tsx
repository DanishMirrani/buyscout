import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions for using BuyScout.",
};

export default function TermsPage() {
  return (
    <Container className="py-16">
      <article className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms & Conditions</h1>
          <p className="text-sm text-muted-foreground">Last Updated: July 14, 2026</p>
        </div>

        <p className="leading-relaxed text-muted-foreground">
          Welcome to BuyScout. By accessing or using our platform, you agree to these terms.
        </p>

        <Section title="Use of BuyScout">
          <p className="text-muted-foreground">
            BuyScout provides product discovery, comparisons, recommendations, and informational
            content. You may use our platform for personal and informational purposes.
          </p>
        </Section>

        <Section title="Product Information">
          <p className="text-muted-foreground">
            We aim to provide accurate and helpful information. However:
          </p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Product specifications may change</li>
            <li>Prices and availability may vary</li>
            <li>Retailer information may change over time</li>
          </ul>
          <p className="text-muted-foreground">
            Users should verify details with the retailer before purchasing.
          </p>
        </Section>

        <Section title="External Retailers">
          <p className="text-muted-foreground">
            BuyScout does not sell products directly. When you click a retailer link, you leave
            BuyScout and interact with a third-party website. Purchases, payments, shipping, and
            returns are handled by the retailer.
          </p>
        </Section>

        <Section title="Content Usage">
          <p className="text-muted-foreground">
            Content published on BuyScout is intended for personal use. You may not reproduce,
            copy, or distribute content without permission.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p className="text-muted-foreground">
            BuyScout provides information for discovery and research purposes. We are not
            responsible for decisions made based on our content or transactions completed with
            third-party retailers.
          </p>
        </Section>
      </article>
    </Container>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}