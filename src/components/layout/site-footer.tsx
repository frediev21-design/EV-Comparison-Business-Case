import Link from "next/link";
import { APP_NAME, DEVELOPER_NAME } from "@/lib/brand";
import { DeveloperCredit } from "@/components/layout/developer-credit";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <div className="flex flex-col gap-2 border-t border-border px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div className="space-y-1">
          <p>{APP_NAME} — estimates for planning only, not financial advice.</p>
          <DeveloperCredit />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/dealers" className="hover:text-foreground">
            For dealers
          </Link>
          <Link href="/prodexa" className="hover:text-foreground">
            {DEVELOPER_NAME}
          </Link>
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