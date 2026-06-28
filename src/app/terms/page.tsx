import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata = {
  title: "Terms of Use | Fleet EV TCO",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto max-w-2xl flex-1 px-4 py-12 lg:px-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-4 text-sm text-muted-foreground">
          <p>
            By using Fleet EV TCO you agree to these terms. If you do not agree, do not use the
            application.
          </p>
          <h2 className="text-base font-semibold text-foreground">Estimates only</h2>
          <p>
            All outputs — including monthly savings, payback periods, investment scores, and market
            values — are indicative estimates for planning and comparison. They are not financial,
            tax, or legal advice. Confirm figures with your finance provider, insurer, and dealer
            before making decisions.
          </p>
          <h2 className="text-base font-semibold text-foreground">Your responsibility</h2>
          <p>
            You are responsible for the accuracy of inputs you provide (loan balances, fuel use,
            trade values, etc.). Incorrect inputs will produce incorrect results.
          </p>
          <h2 className="text-base font-semibold text-foreground">Local data</h2>
          <p>
            Scenarios are stored on your device. You are responsible for exporting backups. We are
            not liable for data loss caused by clearing browser storage or changing devices.
          </p>
          <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
          <p>
            Use the tool lawfully. Do not attempt to disrupt the service or access others&apos;
            data without permission.
          </p>
          <h2 className="text-base font-semibold text-foreground">Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, the application is provided &quot;as is&quot;
            without warranties. We are not liable for decisions made based on estimates from this
            tool.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
