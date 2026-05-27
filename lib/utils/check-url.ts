import {
  normalizePhone,
  normalizeEmail,
  normalizeBankAccount,
} from "@/lib/utils/normalize";

export type CheckType = "phone" | "email" | "account";

export const CHECK_TYPES: CheckType[] = ["phone", "email", "account"];

export function isCheckType(value: string): value is CheckType {
  return (CHECK_TYPES as string[]).includes(value);
}

/**
 * Map URL-friendly check type to internal data_points.type value.
 * "account" exists as a URL slug for cleanliness; the DB uses "bank_account".
 */
export function checkTypeToDataType(type: CheckType): string {
  return type === "account" ? "bank_account" : type;
}

/**
 * Canonicalize an identifier for a given check type.
 * Returns the value used in both the URL path and the DB normalized_value lookup.
 */
export function canonicalizeIdentifier(
  type: CheckType,
  raw: string
): string {
  const decoded = safeDecode(raw);
  switch (type) {
    case "phone":
      return normalizePhone(decoded);
    case "email":
      return normalizeEmail(decoded);
    case "account":
      return normalizeBankAccount(decoded);
  }
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Validate that a canonical identifier is well-formed enough to render a page for.
 * Anything failing this returns 404 to avoid indexable junk URLs.
 */
export function isValidCanonicalIdentifier(
  type: CheckType,
  canonical: string
): boolean {
  if (!canonical) return false;
  switch (type) {
    case "phone":
      // Malaysian E.164: starts with 60, total 10-13 digits
      return /^60\d{8,11}$/.test(canonical);
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(canonical) && canonical.length <= 254;
    case "account":
      return /^\d{6,20}$/.test(canonical);
  }
}

/**
 * Build the canonical URL path for a (type, identifier) pair.
 * Returns the path only, e.g. "/check/phone/60123456789".
 */
export function buildCheckPath(type: CheckType, canonical: string): string {
  return `/check/${type}/${encodeURIComponent(canonical)}`;
}

/**
 * Format an identifier for human-readable display.
 */
export function formatIdentifierDisplay(
  type: CheckType,
  canonical: string
): string {
  switch (type) {
    case "phone":
      // 60123456789 -> +60 12-345 6789
      if (/^60\d+$/.test(canonical)) {
        const local = canonical.substring(2);
        if (local.length >= 9) {
          return `+60 ${local.substring(0, 2)}-${local.substring(2, 5)} ${local.substring(5)}`;
        }
        return `+${canonical}`;
      }
      return canonical;
    case "email":
      return canonical;
    case "account":
      // 1234567890 -> 1234 5678 90
      return canonical.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }
}

export function checkTypeLabel(type: CheckType): string {
  switch (type) {
    case "phone":
      return "Phone Number";
    case "email":
      return "Email Address";
    case "account":
      return "Bank Account";
  }
}
