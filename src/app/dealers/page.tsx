import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import {
  APP_DEALER_PITCH,
  APP_NAME,
  APP_TAGLINE,
  DEVELOPER_CREDIT,
  PAGE_TITLES,
} from "@/lib/brand";
import { DEALER_PROFILES } from "@/config/dealers/profiles";
import {
  ArrowRight,
  FileText,
  Handshake,
  Store,
  Tablet,
  TrendingDown,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: PAGE_TITLES.dealers,
  description: APP_DEALER_PITCH,
};

export default function DealersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader ctaLabel="Try demo" ctaHref="/case/new?dealer=byd-centurion&fresh=1" />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-6 lg:py-24">
          <p className="text-sm font-medium text-accent">For EV &amp; PHEV resellers</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight lg:text-5xl">
            Show buyers what switching saves — in minutes
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{APP_DEALER_PITCH}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/case/new?dealer=byd-centurion&fresh=1">
                Start dealer demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/case/new?fresh=1">Open {APP_NAME}</Link>
            </Button>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4 lg:px-6">
            <h2 className="text-2xl font-bold">Built for the showroom floor</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Turn &ldquo;Is an EV worth it?&rdquo; into a personalised story using the buyer&apos;s
              current instalment, fuel use, and trade-in — not a generic brochure.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Tablet,
                  title: "Tablet-ready",
                  text: "Quick mode gets from current car to dashboard in three steps.",
                },
                {
                  icon: Store,
                  title: "Your stock list",
                  text: "One-click presets for the models you sell — no retyping prices.",
                },
                {
                  icon: FileText,
                  title: "Branded PDF",
                  text: "Dealer name and consultant on exports the buyer can take home.",
                },
                {
                  icon: TrendingDown,
                  title: "Honest numbers",
                  text: "When savings are tight, what-if sliders still beat a guess.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
          <h2 className="text-2xl font-bold">Showroom workflow</h2>
          <ol className="mt-8 space-y-6">
            {[
              "Capture the buyer's current vehicle — instalment, fuel, km, trade value.",
              "Add your stock unit from dealer presets (EV, PHEV, or comparison ICE).",
              "Walk through trade-in, finance, and running costs together.",
              "Present the dashboard — monthly delta, 10-year TCO, investment score.",
              "Export a PDF with your dealership branding before they leave.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-1 text-muted-foreground">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4 lg:px-6">
            <div className="flex items-start gap-3">
              <Handshake className="mt-1 h-5 w-5 text-accent" />
              <div>
                <h2 className="text-2xl font-bold">Demo dealer profiles</h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Each link loads {APP_NAME} with a curated stock list. Select your profile in the
                  sidebar anytime, or share a link with your sales team.
                </p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {DEALER_PROFILES.map((dealer) => (
                <Link
                  key={dealer.id}
                  href={`/case/new?dealer=${dealer.id}&fresh=1`}
                  className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/50 hover:bg-accent/5"
                >
                  <p className="font-semibold">{dealer.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{dealer.tagline}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {dealer.vehiclePresets.map((v) => v.name).join(" · ")}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-accent">
                    Open demo
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-8">
            <div className="flex items-start gap-3">
              <Zap className="mt-1 h-5 w-5 text-accent" />
              <div>
                <h2 className="text-xl font-bold">Pilot your dealership on {APP_NAME}</h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  {APP_TAGLINE}. Custom stock lists, group pricing, and cloud sync are on the
                  roadmap — start with the free demo profiles today. {DEVELOPER_CREDIT}.
                </p>
                <Button className="mt-6" asChild>
                  <Link href="mailto:hello@switchsave.app?subject=Dealer%20pilot">
                    Request dealer pilot
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
