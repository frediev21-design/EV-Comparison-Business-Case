import { describe, expect, it } from "vitest";
import {
  NPV_DISCOUNT_RATE_HINT,
  NPV_DISCOUNT_RATE_LABEL,
  NPV_KPI_TITLE,
  npvKpiSubtitle,
} from "@/lib/npv-explainer";

describe("npv-explainer", () => {
  it("uses plain-language labels without requiring finance jargon", () => {
    expect(NPV_DISCOUNT_RATE_LABEL).not.toMatch(/^NPV/i);
    expect(NPV_KPI_TITLE.toLowerCase()).toContain("switching");
    expect(NPV_DISCOUNT_RATE_HINT.toLowerCase()).toContain("future");
    expect(npvKpiSubtitle(10.5)).toContain("10.5%");
  });
});
