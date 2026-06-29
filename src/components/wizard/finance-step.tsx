"use client";

import { useCaseStore, useSelectedFinance } from "@/store/case-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSliderField } from "./form-field";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { ArrowRight, Car } from "lucide-react";

export function FinanceStep() {
  const selectedId = useCaseStore((s) => s.input.selectedReplacementId);
  const replacements = useCaseStore((s) => s.input.replacements);
  const updateReplacement = useCaseStore((s) => s.updateReplacement);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const finance = useSelectedFinance();
  const vehicle = replacements.find((v) => v.id === selectedId);

  if (!vehicle || !finance) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Finance Engine</h2>
          <p className="text-sm text-muted-foreground">
            Adjust interest rate and finance term once you have a replacement vehicle selected.
          </p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Car className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No replacement vehicle yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add or select a new vehicle before configuring finance.
              </p>
            </div>
            <Button onClick={() => setActiveStep("replacement")}>
              Go to New Vehicle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Finance Engine</h2>
        <p className="text-sm text-muted-foreground">Instant recalculation as you adjust rate and term.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Finance Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormSliderField
              label="Interest rate"
              value={vehicle.interestRate}
              onChange={(v) => updateReplacement(selectedId, { interestRate: v })}
              min={3}
              max={18}
              step={0.1}
              suffix="%"
              displayDecimals={1}
            />
            <FormSliderField
              label="Finance term"
              value={vehicle.financeTermMonths}
              onChange={(v) => updateReplacement(selectedId, { financeTermMonths: Math.round(v) })}
              min={12}
              max={96}
              step={6}
              suffix="months"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Finance Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Amount Financed", value: finance.amountFinanced },
              { label: "Monthly Repayment", value: finance.monthlyInstalment },
              { label: "Total Interest", value: finance.totalInterest },
              { label: "Total Payments", value: finance.totalPayments },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold tabular-nums">{formatCurrency(value)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Amortisation Schedule</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4">Month</th>
                <th className="pb-2 pr-4">Payment</th>
                <th className="pb-2 pr-4">Interest</th>
                <th className="pb-2 pr-4">Capital</th>
                <th className="pb-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {finance.schedule.slice(0, 24).map((row) => (
                <tr key={row.month} className="border-b border-border/50">
                  <td className="py-2 pr-4 tabular-nums">{row.month}</td>
                  <td className="py-2 pr-4 tabular-nums">{formatCurrency(row.payment)}</td>
                  <td className="py-2 pr-4 tabular-nums">{formatCurrency(row.interest)}</td>
                  <td className="py-2 pr-4 tabular-nums">{formatCurrency(row.capital)}</td>
                  <td className="py-2 tabular-nums">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {finance.schedule.length > 24 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing first 24 of {finance.schedule.length} months
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
