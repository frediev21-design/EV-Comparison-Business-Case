import type { WorkflowMode } from "@/lib/wizard-steps";

/** Build main-app case URL preserving case id when upgrading from embed. */
export function buildMainAppCaseUrl(caseId: string | null, mode: WorkflowMode): string {
  const base = caseId ? `/case/${caseId}` : "/case/new?fresh=1";
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}mode=${mode}`;
}

export function isEmbedPath(pathname: string): boolean {
  return pathname.startsWith("/embed");
}

export function embedCasePath(caseId: string | null, fresh = false): string {
  if (!caseId || caseId === "new") {
    return fresh ? "/embed/case/new?fresh=1" : "/embed/case/new";
  }
  return `/embed/case/${caseId}`;
}
