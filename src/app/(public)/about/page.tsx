import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "About BuyScout",
  description:
    "Learn how BuyScout helps shoppers discover, compare, and evaluate products through trusted recommendations and buying guides.",
};

export default function AboutPage() {
  return (
    <Container className="py-16">
      <article className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About BuyScout</h1>
          <p className="text-lg text-muted-foreground">
            Helping You Make Smarter Buying Decisions
          </p>
        </div>

        <Section title="About BuyScout">
          <p>
            BuyScout is a product discovery and recommendation platform designed to help shoppers
            find the right products with confidence.
          </p>
          <p>
            Instead of spending hours searching through countless options, BuyScout brings together
            product information, comparisons, expert insights, and curated recommendations to make
            the buying journey simpler.
          </p>
          <div className="space-y-2">
            <p className="font-medium">We help you:</p>
            <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
              <li>Discover products that match your needs</li>
              <li>Compare features and alternatives</li>
              <li>Understand key differences before buying</li>
              <li>Find trusted retailers where you can complete your purchase</li>
            </ul>
          </div>
        </Section>

        <Section title="Our Mission">
          <p className="font-medium text-foreground">Our mission is simple:</p>
          <p className="text-lg font-semibold text-primary">
            Make product research easier, faster, and more transparent.
          </p>
          <p>
            We believe choosing the right product should not require endless searching through
            reviews, specifications, and conflicting opinions.
          </p>
          <p>
            BuyScout organizes useful information in one place so you can make better decisions.
          </p>
        </Section>

        <Section title="How BuyScout Works">
          <div className="grid gap-6 sm:grid-cols-2">
            <StepCard number="1" title="Discover">
              Search products, categories, and buying guides based on what you need.
            </StepCard>
            <StepCard number="2" title="Compare">
              Explore features, specifications, alternatives, and recommendations.
            </StepCard>
            <StepCard number="3" title="Decide">
              Use our curated information to choose the product that fits your requirements.
            </StepCard>
            <StepCard number="4" title="Purchase">
              When you're ready, we connect you with trusted retailers to complete your purchase.
            </StepCard>
          </div>
        </Section>

        <Section title="Our Commitment">
          <p>
            We focus on providing helpful and transparent recommendations. While we may earn
            commissions through affiliate partnerships, our recommendations are designed to
            prioritize usefulness, value, and user needs.
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
      <div className="space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function StepCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-6">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-sm font-semibold text-foreground">
        {number}
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}