import "server-only";

export type AbdmMode = "sandbox" | "prod";

export interface AbdmRuntimeConfig {
  mode: AbdmMode;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

export function getAbdmConfig(): AbdmRuntimeConfig {
  const mode = (process.env.ABDM_MODE ?? "sandbox").toLowerCase() === "prod" ? "prod" : "sandbox";
  const baseUrl = process.env.ABDM_BASE_URL ?? "";
  const clientId = process.env.ABDM_CLIENT_ID ?? "";
  const clientSecret = process.env.ABDM_CLIENT_SECRET ?? "";
  const callbackUrl = process.env.ABDM_CALLBACK_URL ?? "";

  if (!baseUrl || !clientId || !clientSecret || !callbackUrl) {
    throw new Error("ABDM configuration missing. Set ABDM_BASE_URL, ABDM_CLIENT_ID, ABDM_CLIENT_SECRET, ABDM_CALLBACK_URL.");
  }

  return { mode, baseUrl, clientId, clientSecret, callbackUrl };
}

