/**
 * ABDM integration scaffold (PRD sections 11, 12, 18).
 *
 * This file intentionally contains sandbox-oriented placeholders only.
 * It standardizes payload shapes so replacing stubs with real ABDM HIP/HIU
 * APIs is a drop-in change.
 */

export type AbdmLinkState =
  | "not_linked"
  | "pending_otp"
  | "linked"
  | "revoked"
  | "error";

export interface AbhaLinkRecord {
  uid: string;
  abhaIdMasked: string;
  state: AbdmLinkState;
  linkedAt?: number;
  revokedAt?: number;
  lastError?: string;
  txnId?: string;
}

export interface AbdmConsentArtifact {
  uid: string;
  consentId: string;
  purpose: "medication_safety" | "doctor_share" | "research_aggregate";
  hiTypes: Array<"Prescription" | "DiagnosticReport" | "DischargeSummary" | "HealthDocumentRecord">;
  from: string; // ISO date
  to: string;   // ISO date
  grantedAt: number;
  expiresAt: number;
  status: "active" | "expired" | "revoked";
  gatewayRef?: string;
}

export interface AbdmFhirBundleEnvelope {
  uid: string;
  bundleType: "Bundle";
  fhirVersion: "R4";
  source: "ABDM_SANDBOX" | "ABDM_PROD";
  fetchedAt: number;
  payload: Record<string, unknown>;
}

export function maskAbhaId(raw: string): string {
  if (!raw) return "";
  const s = raw.replace(/\s+/g, "");
  if (s.length <= 4) return "****";
  return `${s.slice(0, 2)}******${s.slice(-2)}`;
}

export function defaultConsentWindowDays(days = 180): { from: string; to: string } {
  const from = new Date();
  const to = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}
