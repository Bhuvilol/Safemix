"use server";
import { mintVC, verifyVC, type SafeMixVC } from "@/lib/vc";

export async function mintRegimenVC(args: Parameters<typeof mintVC>[0]): Promise<SafeMixVC> {
  return await mintVC(args);
}

export async function verifyRegimenVC(jws: string): Promise<boolean> {
  return await verifyVC(jws);
}
