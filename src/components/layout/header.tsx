import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Container } from "./container";
import { Navigation } from "./navigation";
import { MobileNav } from "./mobile-nav";

export function Header() {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
            <Container className="flex h-20 items-center justify-between gap-10">

                <Logo />

                <Navigation />

                <div className="flex flex-1 items-center justify-end gap-2">
                    <ThemeToggle />
                    <MobileNav />
                </div>

            </Container>
        </header>
    );
}
