import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";

interface MarketingHeaderProps {
  ctaHref?: string;
  ctaLabel?: string;
}

export function MarketingHeader({
  ctaHref = "/case/new?fresh=1",
  ctaLabel = "Open app",
}: MarketingHeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="font-semibold tracking-tight hover:opacity-80">
          {APP_NAME}
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/dealers"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            For dealers
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
