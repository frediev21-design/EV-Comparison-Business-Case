import Link from "next/link";
import { DEVELOPER_CREDIT, DEVELOPER_NAME, DEVELOPER_URL } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface DeveloperCreditProps {
  className?: string;
  /** Link to the in-app Prodexa page (default) or the external site */
  href?: string;
}

export function DeveloperCredit({ className, href = "/prodexa" }: DeveloperCreditProps) {
  return (
    <Link
      href={href}
      className={cn("text-muted-foreground hover:text-foreground hover:underline", className)}
    >
      {DEVELOPER_CREDIT}
    </Link>
  );
}

export function DeveloperExternalLink({ className }: { className?: string }) {
  return (
    <a
      href={DEVELOPER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("text-muted-foreground hover:text-foreground hover:underline", className)}
    >
      {DEVELOPER_NAME}
    </a>
  );
}
