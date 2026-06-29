import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { PAGE_TITLES, APP_NAME, DEVELOPER_NAME, DEVELOPER_URL } from "@/lib/brand";

export const metadata = {
  title: PAGE_TITLES.privacy,
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto max-w-2xl flex-1 px-4 py-12 lg:px-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Home
        </Link>
        <h1 className="mt-6 text-2xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: June 2026</p>

        <div className="prose prose-sm mt-8 max-w-none space-y-4 text-sm text-muted-foreground">
          <p>
            {APP_NAME} is developed by{" "}
            <a href={DEVELOPER_URL} className="text-foreground underline" target="_blank" rel="noopener noreferrer">
              {DEVELOPER_NAME}
            </a>{" "}
            ({DEVELOPER_URL.replace(/^https?:\/\//, "")}) and is designed to run primarily in your
            browser. Vehicle comparison inputs,
            scenarios, and calculations are stored locally on your device using IndexedDB unless you
            choose to export data.
          </p>
          <h2 className="text-base font-semibold text-foreground">What we store</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vehicle and finance inputs you enter in the application</li>
            <li>Saved scenarios on this device</li>
            <li>Theme and onboarding preferences in local storage</li>
          </ul>
          <h2 className="text-base font-semibold text-foreground">What we do not do by default</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>We do not require an account for the current version</li>
            <li>We do not sell your financial inputs</li>
            <li>We do not sync your cases to the cloud unless a future signed-in feature is enabled</li>
          </ul>
          <h2 className="text-base font-semibold text-foreground">Market lookups</h2>
          <p>
            If you use SA Market features, vehicle details you submit may be sent to our servers to
            retrieve indicative pricing. These requests are used to return market estimates only.
          </p>
          <h2 className="text-base font-semibold text-foreground">Your choices</h2>
          <p>
            You can delete saved scenarios in the app, clear browser site data, or export JSON
            backups from the Scenarios step.
          </p>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p>
            For privacy questions, contact the operator of this deployment with details shown on
            your organisation&apos;s support channel.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
