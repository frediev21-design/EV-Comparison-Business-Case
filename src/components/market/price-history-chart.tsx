"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface PriceHistoryChartProps {
  history: { month: string; value: number }[];
  future?: { years: number; value: number }[];
}

export function PriceHistoryChart({ history, future }: PriceHistoryChartProps) {
  const futurePoints =
    future?.map((f) => ({
      month: `${f.years}yr`,
      value: undefined as number | undefined,
      futureValue: f.value,
    })) ?? [];

  const data = [
    ...history.map((h) => ({ month: h.month, value: h.value, futureValue: undefined as number | undefined })),
    ...futurePoints,
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Price History & Future Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="value" name="Past 12 Months" stroke="var(--chart-2)" strokeWidth={2} dot />
              <Line type="monotone" dataKey="futureValue" name="Estimated Future" stroke="var(--chart-1)" strokeWidth={2} strokeDasharray="5 5" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
