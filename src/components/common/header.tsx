import Link from "next/link";
import { Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-5 text-center sm:px-6 sm:py-7 lg:px-8">
        <div className="absolute right-4 top-4 sm:right-6 sm:top-5 lg:right-8 lg:top-6">
          <ThemeToggle />
        </div>

        <Link
          href="/"
          className="group flex flex-col items-center transition-opacity hover:opacity-95"
        >
          <div className="shadow-xs mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            <span>2026 WORLDS</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
            2026 롤드컵 경기 일정
          </h1>
        </Link>
      </div>
    </header>
  );
};
