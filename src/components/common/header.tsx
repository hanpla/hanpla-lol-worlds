import Link from "next/link";
import { Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { cn } from "@/lib/utils";

type HeaderProps = {
  className?: string;
};

/**
 * 2026 롤드컵(Worlds) 글로벌 브랜드 상단 고정 네비게이션 헤더 컴포넌트입니다.
 * 불필요한 부제 텍스트를 배제하고 '2026 WORLDS' 브랜드 타이틀과 원클릭 테마 토글(Dark/Light)을 콤팩트하게 제공합니다.
 */
export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label="2026 WORLDS 홈"
        >
          <div className="shadow-xs flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
            <Trophy className="size-4.5 text-primary" />
          </div>

          <h1 className="text-base font-black tracking-wider text-foreground sm:text-lg">
            2026 WORLDS
          </h1>
        </Link>

        <ThemeToggle />
      </div>
    </header>
  );
};
