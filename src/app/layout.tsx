import type { Metadata } from "next";
import { ThemeProvider } from "@/components/common/theme-provider";
import { pretendard } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "2026 롤드컵(Worlds) 경기 일정",
  description: "2026 League of Legends World Championship 경기 일정 및 실시간 스케줄",
  openGraph: {
    title: "2026 롤드컵(Worlds) 경기 일정",
    description: "2026 League of Legends World Championship 경기 일정 및 실시간 스케줄",
    type: "website",
    locale: "ko_KR",
    siteName: "2026 롤드컵 일정",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 롤드컵(Worlds) 경기 일정",
    description: "2026 League of Legends World Championship 경기 일정 및 실시간 스케줄",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko" className={pretendard.variable} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-primary",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
