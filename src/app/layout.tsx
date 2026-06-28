import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AutoSaveProvider } from "@/components/providers/auto-save-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Fleet EV TCO | Business Case Platform",
  description: "Enterprise-grade fleet EV business case and total cost of ownership analysis",
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
          <AutoSaveProvider>{children}</AutoSaveProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
