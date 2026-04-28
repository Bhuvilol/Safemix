/**
 * Verifiable Credential signing for the doctor-share report (PRD §9.4).
 *
 * Production: full W3C VC + DID:web with Ed25519. For the demo we ship a
 * compact JWS signed with the same QR_SECRET (HS256) so any doctor can
 * verify the report offline by scanning the printed QR + entering the
 * SafeMix public verification URL. The structure already matches the
 * shape of a W3C VC, so swapping to Ed25519 later is a one-file change.
 */
import { SignJWT, jwtVerify } from "jose";

export interface SafeMixVC {
  /** The signed compact JWS string the doctor scans/downloads. */
  jws: string;
  /** Decoded header for offline display ("issued by", "issued at", "valid until") */
  header: {
    issuer: string;
    issuedAt: number;
    expiresAt: number;
    subjectJti: string;
  };
}

function getSecret(): Uint8Array {
  const secret = process.env.QR_SECRET ?? process.env.NEXT_PUBLIC_QR_SECRET;
  if (!secret) throw new Error("QR_SECRET not configured");
  return new TextEncoder().encode(secret);
}

export async function mintVC(args: {
  patientName: string;
  patientUid: string;
  shareJti: string;
  medications: Array<{ name: string; system: string; dosage?: string; frequency?: string }>;
  alerts: Array<{ medicines: string[]; verdict: string; reason: string }>;
  ttlMs: number;
}): Promise<SafeMixVC> {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + args.ttlMs;

  const credential = {
    "@context": ["https://www.w3.org/ns/credentials/v2", "https://safemix.in/contexts/v1"],
    type: ["VerifiableCredential", "MedicationRegimenReview"],
    issuer: "did:web:safemix.in",
    issuanceDate: new Date(issuedAt).toISOString(),
    expirationDate: new Date(expiresAt).toISOString(),
    credentialSubject: {
      id: `urn:safemix:patient:${args.patientUid.slice(0, 12)}`,
      name: args.patientName,
      regimen: args.medications,
      activeAlerts: args.alerts,
      reviewedBy: "SafeMix AYUSH-Clinical Review (automated + reviewer-gated)",
      shareReceiptId: args.shareJti,
    },
  };

  const jws = await new SignJWT({ vc: credential, jti: args.shareJti })
    .setProtectedHeader({ alg: "HS256", typ: "vc+jwt" })
    .setIssuer("did:web:safemix.in")
    .setIssuedAt(Math.floor(issuedAt / 1000))
    .setExpirationTime(Math.floor(expiresAt / 1000))
    .setJti(args.shareJti)
    .sign(getSecret());

  return {
    jws,
    header: {
      issuer: "did:web:safemix.in",
      issuedAt,
      expiresAt,
      subjectJti: args.shareJti,
    },
  };
}

export async function verifyVC(jws: string): Promise<boolean> {
  try {
    await jwtVerify(jws, getSecret(), { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}
