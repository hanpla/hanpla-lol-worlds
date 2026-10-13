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
      aria-disabled={isInactive}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border border-border/80 bg-card/90 text-foreground shadow-md backdrop-blur-md transition-all duration-200 hover:border-primary/60 hover:bg-card hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 sm:size-11",
        isInactive ? "cursor-default opacity-40 hover:opacity-80" : "opacity-100",
      )}
      aria-label={`${label} 스크롤 이동`}
      title={label}
    >
      <Icon className="size-4.5 sm:size-5" />
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
      className={cn(
        "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex flex-col items-center gap-2 sm:bottom-6 sm:right-6",
        className,
      )}
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
