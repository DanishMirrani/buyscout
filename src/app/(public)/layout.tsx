// 1. External Node Modules / Core Libraries
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// 2. Internal Aliased Components and Context Providers
import { Providers } from "@/providers/providers";
import { siteConfig } from "@/config/site";
import { AppLayout } from "@/components/layout/app-layout";

// 3. Global CSS and Side-Effect Modules (always last)
import "../globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
