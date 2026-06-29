import type { Metadata } from "next";
import { APP_DESCRIPTION, PAGE_TITLES } from "@/lib/brand";

export const metadata: Metadata = {
  title: PAGE_TITLES.embed,
  description: APP_DESCRIPTION,
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
