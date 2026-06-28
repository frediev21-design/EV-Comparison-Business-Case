import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AutoSaveProvider } from "@/components/providers/auto-save-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { PwaProvider } from "@/components/providers/pwa-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fleet EV TCO | Compare Your Vehicle vs EV & Hybrid",
  description:
    "Free South African vehicle comparison tool. Calculate finance, fuel, trade-in, solar, and total cost of ownership for EV and hybrid replacements.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Fleet EV TCO",
  },
  openGraph: {
    title: "Fleet EV TCO — Business Case Calculator",
    description: "Compare your current vehicle with EV and hybrid replacements in minutes.",
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
              <AutoSaveProvider>{children}</AutoSaveProvider>
            </PwaProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
