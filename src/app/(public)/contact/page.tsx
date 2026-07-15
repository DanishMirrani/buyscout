"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Handshake, HelpCircle, Send } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // In a real app, send to an API endpoint
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
            <Send className="size-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Message Sent</h1>
          <p className="text-muted-foreground">
            Thank you for reaching out. We'll get back to you as soon as possible.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact BuyScout</h1>
          <p className="text-lg text-muted-foreground">Get in Touch</p>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Have a question, suggestion, or feedback? We would love to hear from you.
          </p>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Whether you found an issue, want to suggest a product category, or have a partnership
            inquiry, our team is here to help.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5 rounded-3xl border border-border/70 bg-background/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject <span className="text-destructive">*</span>
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What is this about?"
              required
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message <span className="text-destructive">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more..."
              required
              rows={5}
              className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 outline-none resize-y min-h-[120px]"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            <Send className="size-4" />
            Send Message
          </Button>
        </form>

        {/* Common reasons */}
        <section className="space-y-6">
          <h2 className="text-center text-2xl font-bold tracking-tight">Common Reasons to Contact Us</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <ReasonCard
              icon={MessageSquare}
              title="Content Feedback"
              description="Found incorrect information or outdated details? Let us know."
            />
            <ReasonCard
              icon={Handshake}
              title="Partnership Requests"
              description="Interested in working with BuyScout?"
            />
            <ReasonCard
              icon={HelpCircle}
              title="General Questions"
              description="Have questions about how BuyScout works?"
            />
          </div>
        </section>
      </div>
    </Container>
  );
}

function ReasonCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-background p-6 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/50">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}