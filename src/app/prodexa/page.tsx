import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { MarketingHeader } from "@/components/layout/marketing-header";
import {
  APP_NAME,
  DEVELOPER_NAME,
  DEVELOPER_TAGLINE,
  DEVELOPER_URL,
  PAGE_TITLES,
} from "@/lib/brand";
import { ArrowRight, ExternalLink, Layers, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: PAGE_TITLES.prodexa,
  description: `${DEVELOPER_NAME} builds practical software for business decisions. ${APP_NAME} is our vehicle upgrade calculator for EV and PHEV resellers.`,
};

export default function ProdexaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader ctaHref="/" ctaLabel={APP_NAME} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-6 lg:py-24">
          <p className="text-sm font-medium text-accent">{DEVELOPER_TAGLINE}</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight lg:text-5xl">
            {DEVELOPER_NAME}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            We build focused tools that help businesses and their customers make clearer financial
            decisions — without spreadsheets or guesswork.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href={DEVELOPER_URL} target="_blank" rel="noopener noreferrer">
                Visit {DEVELOPER_URL.replace(/^https?:\/\//, "")}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dealers">
                {APP_NAME} for dealers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-4 lg:px-6">
            <h2 className="text-2xl font-bold">What we build</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Practical SaaS and calculators where the numbers need to be defensible — not just
              pretty.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Decision tools",
                  text: "Apps that turn complex comparisons into clear outcomes for sales and finance teams.",
                },
                {
                  icon: Layers,
                  title: "Vertical focus",
                  text: "Deep domain logic — not generic dashboards — starting with automotive and fleet.",
                },
                {
                  icon: Sparkles,
                  title: "Ready to ship",
                  text: "Fast to deploy, private by default, and built for real showroom and boardroom use.",
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
          <div className="rounded-xl border border-accent/30 bg-accent/5 p-8">
            <p className="text-sm font-medium text-accent">Featured product</p>
            <h2 className="mt-2 text-2xl font-bold">{APP_NAME}</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              The upgrade calculator for EV and PHEV resellers. Show buyers what switching saves —
              trade-in, finance, running costs, and 10-year TCO — with a PDF they can take home.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/case/new?fresh=1">
                  Try {APP_NAME}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dealers">Dealer programme</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border py-12">
          <div className="mx-auto max-w-5xl px-4 text-center lg:px-6">
            <p className="text-sm text-muted-foreground">
              Questions or partnership enquiries?
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <a href="mailto:hello@prodexa.com?subject=Prodexa360%20enquiry">
                hello@prodexa.com
              </a>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
