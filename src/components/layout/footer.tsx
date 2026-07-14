import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-0 sm:h-20">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/categories" className="hover:text-foreground transition-colors">
              Categories
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} BuyScout</p>
            <p className="hidden sm:block">Smart product discovery</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
