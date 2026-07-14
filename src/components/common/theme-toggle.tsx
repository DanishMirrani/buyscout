"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            className="hidden md:flex"
            aria-label="Toggle theme"
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
            }
        >
            {theme === "dark" ? (
                <Sun />
            ) : (
                <Moon />
            )}
        </Button>
    );
}