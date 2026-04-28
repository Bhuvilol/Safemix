import "server-only";

export type AbdmMode = "sandbox" | "prod";

export interface AbdmRuntimeConfig {
  mode: AbdmMode;
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  tokenPath: string;
  consentRequestPath: string;
  tokenField: string;
  consentAckField: string;
  enabled: boolean;
}

export function getAbdmConfig(): AbdmRuntimeConfig {
  const mode = (process.env.ABDM_MODE ?? "sandbox").toLowerCase() === "prod" ? "prod" : "sandbox";
  const baseUrl = process.env.ABDM_BASE_URL ?? "";
  const clientId = process.env.ABDM_CLIENT_ID ?? "";
  const clientSecret = process.env.ABDM_CLIENT_SECRET ?? "";
  const callbackUrl = process.env.ABDM_CALLBACK_URL ?? "";
  const tokenPath = process.env.ABDM_TOKEN_PATH ?? "/v1/auth/token";
  const consentRequestPath = process.env.ABDM_CONSENT_REQUEST_PATH ?? "/v1/consents/requests";
  const tokenField = process.env.ABDM_TOKEN_FIELD ?? "accessToken";
  const consentAckField = process.env.ABDM_CONSENT_ACK_FIELD ?? "requestId";

  const enabled = Boolean(baseUrl && clientId && clientSecret && callbackUrl);

  return { mode, baseUrl, clientId, clientSecret, callbackUrl, tokenPath, consentRequestPath, tokenField, consentAckField, enabled };
}
