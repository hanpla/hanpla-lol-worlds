"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { smoothScrollTo } from "@/lib/scroll/smooth-scroll";
import { cn } from "@/lib/utils";

type ScrollFloatingButtonsProps = {
  className?: string;
};

type ScrollButtonProps = {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
  isInactive: boolean;
};

const ScrollButton = ({ label, onClick, icon: Icon, isInactive }: ScrollButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-card/85 text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:border-primary/60 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 sm:h-10 sm:w-10",
        isInactive ? "opacity-60 hover:opacity-100" : "opacity-100",
      )}
      aria-label={`${label} 스크롤 이동`}
      title={label}
    >
      <Icon className="sm:h-4.5 sm:w-4.5 h-4 w-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
};

export const ScrollFloatingButtons = ({ className }: ScrollFloatingButtonsProps) => {
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const cancelScrollRef = useRef<(() => void) | null>(null);

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
      cancelScrollRef.current?.();
    };
  }, []);

  const handleScrollToTop = () => {
    cancelScrollRef.current?.();
    cancelScrollRef.current = smoothScrollTo(0);
  };

  const handleScrollToBottom = () => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
    const maxScrollTop = Math.max(0, scrollHeight - window.innerHeight);
    cancelScrollRef.current?.();
    cancelScrollRef.current = smoothScrollTo(maxScrollTop);
  };

  return (
    <div
      className={cn("fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2", className)}
      role="region"
      aria-label="화면 스크롤 이동 컨트롤"
    >
      <ScrollButton
        label="최상단으로 이동"
        onClick={handleScrollToTop}
        icon={ArrowUp}
        isInactive={isAtTop}
      />
      <ScrollButton
        label="최하단으로 이동"
        onClick={handleScrollToBottom}
        icon={ArrowDown}
        isInactive={isAtBottom}
      />
    </div>
  );
};
