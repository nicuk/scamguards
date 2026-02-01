/**
 * Normalize phone numbers for consistent searching
 * Handles Malaysian phone formats
 */
export function normalizePhone(phone: string): string {
  // Remove all non-digit characters
  let normalized = phone.replace(/\D/g, "");

  // Handle Malaysian country code variations
  if (normalized.startsWith("60")) {
    // Already has country code without +
    normalized = normalized;
  } else if (normalized.startsWith("0")) {
    // Local format, add country code
    normalized = "60" + normalized.substring(1);
  }

  return normalized;
}

/**
 * Normalize email addresses
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Normalize bank account numbers
 */
export function normalizeBankAccount(account: string): string {
  // Remove spaces and dashes
  return account.replace(/[\s-]/g, "");
}

/**
 * Normalize crypto wallet addresses
 */
export function normalizeCryptoWallet(wallet: string): string {
  return wallet.trim().toLowerCase();
}

/**
 * Normalize name for fuzzy matching
 */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " "); // Collapse multiple spaces
}

/**
 * Normalize any data point based on its type
 */
export function normalizeDataPoint(
  type: string,
  value: string
): string {
  switch (type) {
    case "phone":
    case "whatsapp":
      return normalizePhone(value);
    case "email":
      return normalizeEmail(value);
    case "bank_account":
      return normalizeBankAccount(value);
    case "crypto_wallet":
      return normalizeCryptoWallet(value);
    case "name":
    case "company":
      return normalizeName(value);
    default:
      return value.trim().toLowerCase();
  }
}

/**
 * Format phone number for display (Malaysian format)
 */
export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  
  if (normalized.length === 11 || normalized.length === 12) {
    // Mobile: 60 1X XXX XXXX
    if (normalized.startsWith("601")) {
      const prefix = normalized.substring(0, 4);
      const middle = normalized.substring(4, 7);
      const last = normalized.substring(7);
      return `+${prefix.substring(0, 2)} ${prefix.substring(2)}-${middle} ${last}`;
    }
  }
  
  // Return with + prefix if starts with country code
  if (normalized.startsWith("60")) {
    return `+${normalized}`;
  }
  
  return phone;
}

/**
 * Mask sensitive data for display
 */
export function maskValue(type: string, value: string): string {
  switch (type) {
    case "phone":
    case "whatsapp": {
      const normalized = normalizePhone(value);
      if (normalized.length >= 8) {
        return normalized.substring(0, 4) + "****" + normalized.substring(normalized.length - 4);
      }
      return "****" + normalized.substring(normalized.length - 4);
    }
    case "email": {
      const [local, domain] = value.split("@");
      if (local && domain) {
        const maskedLocal = local.substring(0, 2) + "***";
        return `${maskedLocal}@${domain}`;
      }
      return "***@***";
    }
    case "bank_account": {
      const normalized = normalizeBankAccount(value);
      if (normalized.length >= 8) {
        return "****" + normalized.substring(normalized.length - 4);
      }
      return "****";
    }
    case "name":
    case "company": {
      const words = value.split(" ");
      return words.map(w => w.charAt(0) + "***").join(" ");
    }
    default:
      if (value.length > 8) {
        return value.substring(0, 4) + "****";
      }
      return "****";
  }
}
