import Link from "next/link";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <div className="flex flex-col gap-2 border-t border-border px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p>Estimates for planning only — not financial advice.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
