import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="text-xl font-semibold tracking-tight"
    >
      {siteConfig.name}
    </Link>
  );
}