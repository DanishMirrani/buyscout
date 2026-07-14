import { Footer } from "./footer";
import { Header } from "./header";
import { ScrollToTop } from "./scroll-to-top";

export function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}