import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Navigation() {
  return (
    <nav className="hidden gap-6 md:flex">
      {siteConfig.navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}