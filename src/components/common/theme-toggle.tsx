"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/80 text-foreground backdrop-blur-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
        className,
      )}
      aria-label="다크/라이트 테마 전환"
      title={
        mounted
          ? resolvedTheme === "dark"
            ? "라이트 모드로 전환"
            : "다크 모드로 전환"
          : "테마 전환"
      }
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 text-amber-500 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 text-primary transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">테마 전환</span>
    </button>
  );
};
