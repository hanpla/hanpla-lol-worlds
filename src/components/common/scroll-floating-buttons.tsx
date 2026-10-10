"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollFloatingButtonsProps = {
  className?: string;
};

export const ScrollFloatingButtons = ({ className }: ScrollFloatingButtonsProps) => {
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      setIsAtTop(scrollTop < 40);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const smoothScrollTo = (targetY: number) => {
    if (typeof window === "undefined") return;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const startY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) return;

    // 최소 450ms ~ 최대 800ms 동안 시각적으로 확실히 체감되는 부드러운 가감속 애니메이션 보장
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 450), 800);
    const startTime = performance.now();

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      const nextY = Math.round(startY + distance * ease);
      window.scrollTo(0, nextY);
      if (document.documentElement.scrollTop !== nextY) {
        document.documentElement.scrollTop = nextY;
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
        window.scrollTo(0, targetY);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  const handleScrollToTop = () => {
    smoothScrollTo(0);
  };

  const handleScrollToBottom = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    const maxScrollTop = Math.max(0, scrollHeight - window.innerHeight);
    smoothScrollTo(maxScrollTop);
  };

  return (
    <div
      className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2", className)}
      role="region"
      aria-label="화면 스크롤 이동 컨트롤"
    >
      <button
        type="button"
        onClick={handleScrollToTop}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-card/85 text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:border-primary/60 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 sm:h-10 sm:w-10",
          isAtTop ? "opacity-60 hover:opacity-100" : "opacity-100",
        )}
        aria-label="최상단으로 스크롤 이동"
        title="최상단으로 이동"
      >
        <ArrowUp className="sm:h-4.5 sm:w-4.5 h-4 w-4" />
        <span className="sr-only">최상단으로 이동</span>
      </button>

      <button
        type="button"
        onClick={handleScrollToBottom}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-card/85 text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:border-primary/60 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 sm:h-10 sm:w-10",
          isAtBottom ? "opacity-60 hover:opacity-100" : "opacity-100",
        )}
        aria-label="최하단으로 스크롤 이동"
        title="최하단으로 이동"
      >
        <ArrowDown className="sm:h-4.5 sm:w-4.5 h-4 w-4" />
        <span className="sr-only">최하단으로 이동</span>
      </button>
    </div>
  );
};
