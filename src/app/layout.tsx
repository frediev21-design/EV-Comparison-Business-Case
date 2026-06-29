import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AutoSaveProvider } from "@/components/providers/auto-save-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { DealerProvider } from "@/components/dealer/dealer-provider";
import { APP_DESCRIPTION, APP_NAME, PAGE_TITLES } from "@/lib/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: PAGE_TITLES.app,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
  },
  openGraph: {
    title: PAGE_TITLES.home,
    description: APP_DESCRIPTION,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ToastProvider>
            <PwaProvider>
              <Suspense fallback={null}>
                <DealerProvider>
                  <AutoSaveProvider>{children}</AutoSaveProvider>
                </DealerProvider>
              </Suspense>
            </PwaProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
