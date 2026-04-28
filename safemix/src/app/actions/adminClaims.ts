"use server";

import { getAdminAuth } from "@/lib/firebase/admin";

const ALLOWED_ROLES = ["patient", "caregiver", "doctor", "reviewer", "admin"] as const;
export type SafeMixRole = (typeof ALLOWED_ROLES)[number];

function assertRole(role: string): asserts role is SafeMixRole {
  if (!(ALLOWED_ROLES as readonly string[]).includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }
}

/**
 * Sets Firebase Auth custom claim `role` for the target uid.
 * Caller access is already protected by AdminGuard UI; Firestore/audit trails
 * should be added by the caller if needed.
 */
export async function setUserRole(uid: string, role: string) {
  if (!uid) throw new Error("uid required");
  assertRole(role);

  const adminAuth = getAdminAuth();
  const user = await adminAuth.getUser(uid);
  const prevClaims = user.customClaims ?? {};

  await adminAuth.setCustomUserClaims(uid, {
    ...prevClaims,
    role,
  });

  return { uid, role };
}

/**
 * Bootstrap custom role claim for the currently signed-in user after signup.
 * Only allows patient/caregiver self-assignment; elevated roles remain admin-only.
 */
export async function initializeSelfRole(uid: string, role: string) {
  if (!uid) throw new Error("uid required");
  assertRole(role);
  if (role !== "patient" && role !== "caregiver") {
    throw new Error("Only patient/caregiver roles can be self-initialized");
  }

  const adminAuth = getAdminAuth();
  const user = await adminAuth.getUser(uid);
  const prevClaims = user.customClaims ?? {};

  if (prevClaims.role && prevClaims.role !== role) {
    throw new Error("Role already assigned; contact support for role changes");
  }

  await adminAuth.setCustomUserClaims(uid, {
    ...prevClaims,
    role,
  });

  return { uid, role };
}
