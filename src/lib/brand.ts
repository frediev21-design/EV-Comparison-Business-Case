export const APP_NAME = "SwitchSave";
export const APP_TAGLINE = "See what switching saves";
export const APP_DESCRIPTION =
  "Compare your current vehicle with EV and PHEV replacements — trade-in, finance, running costs, and 10-year savings.";
export const APP_DEALER_PITCH =
  "The upgrade calculator for EV and PHEV dealers. Show buyers personalised savings in minutes.";

export const DEVELOPER_NAME = "Prodexa360";
export const DEVELOPER_URL = "https://www.prodexa.com";
export const DEVELOPER_TAGLINE = "Software for smarter business decisions";
export const DEVELOPER_CREDIT = `Developed by ${DEVELOPER_NAME}`;

export const PAGE_TITLES = {
  home: `${APP_NAME} — Compare ICE, PHEV & EV`,
  dealers: `${APP_NAME} for Dealers`,
  prodexa: `${DEVELOPER_NAME} | ${DEVELOPER_TAGLINE}`,
  cases: `My analyses | ${APP_NAME}`,
  privacy: `Privacy Policy | ${APP_NAME}`,
  terms: `Terms of Use | ${APP_NAME}`,
  app: `${APP_NAME} | Vehicle upgrade calculator`,
} as const;

export interface ExportBranding {
  appName: string;
  developerName: string;
  developerUrl?: string;
  dealerName?: string;
  dealerTagline?: string;
  consultantName?: string;
}

export function defaultExportBranding(): ExportBranding {
  return {
    appName: APP_NAME,
    developerName: DEVELOPER_NAME,
    developerUrl: DEVELOPER_URL,
  };
}

export function formatExportHeader(branding: ExportBranding): string {
  const lines: string[] = [];
  if (branding.dealerName) lines.push(branding.dealerName);
  const meta = [branding.appName, branding.consultantName].filter(Boolean).join(" · ");
  if (meta) lines.push(meta);
  if (branding.dealerTagline && branding.dealerName) lines.push(branding.dealerTagline);
  return lines.join("\n");
}

export function formatDeveloperCredit(branding: ExportBranding): string {
  const url = branding.developerUrl ?? DEVELOPER_URL;
  return `Developed by ${branding.developerName} · ${url.replace(/^https?:\/\//, "")}`;
}
