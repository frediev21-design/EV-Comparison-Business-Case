"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCaseStore } from "@/store/case-store";
import { formatCurrency } from "@/lib/format";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">{children}</div>
      </CardContent>
    </Card>
  );
}

const tooltipFormatter = (value: number) => formatCurrency(value);

export function ChartSuite() {
  const charts = useCaseStore((s) => s.result.charts);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Interactive Charts</h2>
        <p className="text-sm text-muted-foreground">Real-time visual analysis of your business case.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Monthly Cash Flow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.monthlyCashFlow}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Bar dataKey="current" name="Current" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replacement" name="Replacement" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fuel vs Electricity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.fuelVsElectricity}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Bar dataKey="fuel" name="Fuel" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="electricity" name="Electricity" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Finance Balance">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.financeBalance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Area type="monotone" dataKey="balance" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ownership Cost">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.ownershipCost}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Line type="monotone" dataKey="current" name="Current" stroke="var(--chart-2)" strokeWidth={2} />
              <Line type="monotone" dataKey="replacement" name="Replacement" stroke="var(--chart-1)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cost per km">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.costPerKm}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${v.toFixed(1)}`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `R${v.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="current" name="Current" stroke="var(--chart-2)" strokeWidth={2} />
              <Line type="monotone" dataKey="replacement" name="Replacement" stroke="var(--chart-1)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Cumulative Savings">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={charts.cumulativeSavings}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Area type="monotone" dataKey="cumulative" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="10-Year TCO">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.tenYearTco}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Bar dataKey="current" name="Current" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replacement" name="Replacement" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Break-even Point">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.breakEven}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Line type="monotone" dataKey="cumulative" name="Cumulative Savings" stroke="var(--chart-1)" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Solar Contribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.solarContribution}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {charts.solarContribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Maintenance Costs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.maintenanceCosts}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Bar dataKey="current" name="Current" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replacement" name="Replacement" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
