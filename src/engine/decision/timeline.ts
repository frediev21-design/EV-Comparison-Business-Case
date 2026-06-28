import { addMonths, addYears, format } from "date-fns";
import type { BusinessCaseInput } from "../types";
import type { TimelineEvent } from "./types";

export function buildDecisionTimeline(input: BusinessCaseInput): TimelineEvent[] {
  const selected = input.replacements.find((v) => v.id === input.selectedReplacementId);
  const today = new Date();

  const delivery = addMonths(today, 2);
  const warrantyEnd = selected ? addYears(delivery, selected.warrantyYears) : addYears(delivery, 5);
  const batteryWarrantyEnd = selected
    ? addYears(delivery, selected.batteryWarrantyYears)
    : addYears(delivery, 8);
  const replacementYear = addYears(delivery, 10);

  const fmt = (d: Date) => format(d, "MMM yyyy");

  return [
    { id: "today", label: "Today", date: fmt(today), description: "Business case evaluation" },
    { id: "trade", label: "Trade Vehicle", date: fmt(addMonths(today, 1)), description: "Trade-in settlement" },
    {
      id: "purchase",
      label: "Purchase Vehicle",
      date: fmt(delivery),
      description: selected?.name ?? "Replacement vehicle",
    },
    {
      id: "finance",
      label: "Finance Approval",
      date: fmt(addMonths(today, 1)),
      description: `${selected?.financeTermMonths ?? 72} month term`,
    },
    { id: "delivery", label: "Delivery", date: fmt(delivery) },
    {
      id: "warranty",
      label: "Warranty Period",
      date: `${fmt(delivery)} – ${fmt(warrantyEnd)}`,
    },
    {
      id: "battery-warranty",
      label: "Battery Warranty Expiry",
      date: fmt(batteryWarrantyEnd),
    },
    {
      id: "replacement",
      label: "Estimated Replacement Year",
      date: fmt(replacementYear),
      description: "10-year ownership horizon",
    },
  ];
}
