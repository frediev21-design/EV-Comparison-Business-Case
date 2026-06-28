"use client";

import { useCaseStore } from "@/store/case-store";
import { buildCurrentMonthlyFromInputs } from "@/lib/current-monthly-breakdown";
import { hasWhatIfOverrides } from "@/lib/wizard-steps";
import { formatCurrency } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CurrentMonthlyBreakdownCard() {
  const input = useCaseStore((s) => s.input);
  const whatIfActive = hasWhatIfOverrides(input.whatIf);
  const breakdown = buildCurrentMonthlyFromInputs(input);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Current Vehicle — Monthly Cost Breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">
          Calculated from your <strong>Current Vehicle</strong> step entries — loan instalment,
          fuel (from km/day, consumption, fuel price), and each annual cost you entered.
        </p>
        {whatIfActive && (
          <p className="text-xs text-warning">
            What-If overrides are active. Monthly Saving KPIs use adjusted assumptions; this table
            shows your base Current Vehicle inputs only.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Component</th>
              <th className="pb-2 text-right font-medium">Annual</th>
              <th className="pb-2 text-right font-medium">Monthly</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-2.5">
                <span className="font-medium">Loan instalment</span>
                <p className="text-xs text-muted-foreground">
                  You entered R{breakdown.enteredInstalment.toLocaleString()}/month
                  {breakdown.instalmentAdjusted &&
                    ` · adjusted to ${formatCurrency(breakdown.instalment)}/mo (looks like total cost, not loan only)`}
                </p>
              </td>
              <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                {formatCurrency(breakdown.instalment * 12)}
              </td>
              <td className="py-2.5 text-right tabular-nums font-medium">
                {formatCurrency(breakdown.instalment)}
              </td>
            </tr>
            {breakdown.lines.map(({ label, annual, monthly, source }) => (
              <tr key={label} className="border-b border-border/50">
                <td className="py-2.5">
                  <span>{label}</span>
                  <p className="text-xs text-muted-foreground">{source}</p>
                </td>
                <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(annual)}
                </td>
                <td className="py-2.5 text-right tabular-nums">{formatCurrency(monthly)}</td>
              </tr>
            ))}
            <tr className="border-b border-border/50">
              <td className="py-2.5 font-medium">Operating subtotal</td>
              <td className="py-2.5 text-right tabular-nums text-muted-foreground">
                {formatCurrency(breakdown.running.total)}
              </td>
              <td className="py-2.5 text-right tabular-nums font-medium">
                {formatCurrency(breakdown.operatingMonthly)}
              </td>
            </tr>
            <tr>
              <td className="pt-3 font-semibold">Total monthly cost</td>
              <td className="pt-3 text-right tabular-nums text-muted-foreground">
                {formatCurrency(breakdown.totalMonthly * 12)}
              </td>
              <td className="pt-3 text-right tabular-nums text-lg font-bold text-accent">
                {formatCurrency(breakdown.totalMonthly)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-xs text-muted-foreground">
          {formatCurrency(breakdown.instalment)} instalment + {formatCurrency(breakdown.operatingMonthly)}{" "}
          operating = {formatCurrency(breakdown.totalMonthly)}/month
        </p>
      </CardContent>
    </Card>
  );
}
