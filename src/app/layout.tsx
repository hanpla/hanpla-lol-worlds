import type { Metadata } from "next";
import { ThemeProvider } from "@/components/common/theme-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "2026 롤드컵(Worlds) 경기 일정",
  description: "2026 League of Legends World Championship 경기 일정 및 실시간 스케줄",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
