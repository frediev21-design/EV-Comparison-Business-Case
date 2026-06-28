import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { ArrowRight, BarChart3, Car, Shield, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 lg:px-6">
          <span className="font-semibold tracking-tight">Fleet EV TCO</span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/case/new">Open app</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-6 lg:py-24">
          <p className="text-sm font-medium text-accent">South African fleet &amp; business cases</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight lg:text-5xl">
            Compare your current vehicle with EV and hybrid replacements
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Finance, fuel, trade-in, solar charging, and total cost of ownership — calculated in
            minutes. No spreadsheet required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/case/new">
                Start free analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/cases">My analyses</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Data saves on your device. Export anytime from Scenarios. Estimates only — not financial
            advice.
          </p>
        </section>

        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3 lg:px-6">
            {[
              {
                icon: Car,
                title: "Enter your vehicle",
                text: "Loan instalment, fuel use, trade value, and daily km — we handle the rest.",
              },
              {
                icon: BarChart3,
                title: "Compare replacements",
                text: "EV, PHEV, or ICE alternatives with finance, running costs, and payback.",
              },
              {
                icon: Zap,
                title: "Decide with confidence",
                text: "Executive dashboard, investment score, and board-ready reports.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 lg:px-6">
          <div className="flex items-start gap-3 rounded-xl border border-border p-6">
            <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="font-semibold">Private by default</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your inputs stay in your browser unless you export them. No account required to
                start. Read our{" "}
                <Link href="/privacy" className="text-foreground underline">
                  privacy policy
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
