import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how BuyScout collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-16">
      <article className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last Updated: July 14, 2026</p>
        </div>

        <p className="leading-relaxed text-muted-foreground">
          At BuyScout, we respect your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and protect information
          when you use our platform.
        </p>

        <Section title="Information We Collect">
          <p className="font-medium text-foreground">We may collect:</p>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-medium text-foreground">Information You Provide</h3>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Contact information when you submit forms</li>
                <li>Feedback or messages you send us</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium text-foreground">Automatically Collected Information</h3>
              <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
                <li>Browser information</li>
                <li>Device information</li>
                <li>Usage analytics</li>
                <li>Pages visited and interactions</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section title="How We Use Information">
          <p className="text-muted-foreground">We use collected information to:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Improve our website experience</li>
            <li>Understand how users interact with our platform</li>
            <li>Respond to inquiries</li>
            <li>Improve recommendations and content</li>
          </ul>
        </Section>

        <Section title="Cookies and Analytics">
          <p className="text-muted-foreground">
            BuyScout may use cookies and analytics tools to understand website usage and improve
            performance.
          </p>
          <p className="font-medium text-foreground">Cookies help us:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Remember preferences</li>
            <li>Analyze traffic</li>
            <li>Improve user experience</li>
          </ul>
        </Section>

        <Section title="Third-Party Links">
          <p className="text-muted-foreground">
            BuyScout may link to external retailers and websites. We are not responsible for the
            privacy practices or content of third-party websites.
          </p>
        </Section>

        <Section title="Data Security">
          <p className="text-muted-foreground">
            We take reasonable measures to protect information and maintain a secure platform.
          </p>
        </Section>

        <Section title="Contact Us">
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, please{" "}
            <Link href="/contact" className="text-primary underline underline-offset-4 hover:no-underline">
              contact us
            </Link>
            .
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