/**
 * Validate Malaysian phone number
 */
export function isValidMalaysianPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");
  
  // Check for valid Malaysian mobile/landline patterns
  // Mobile: 01X-XXX XXXX (10-11 digits with country code = 11-12 digits)
  // With +60: 601X XXX XXXX
  
  // Without country code
  if (digits.startsWith("01")) {
    return digits.length >= 10 && digits.length <= 11;
  }
  
  // With country code
  if (digits.startsWith("60")) {
    return digits.length >= 11 && digits.length <= 12;
  }
  
  // Landline (less strict)
  if (digits.startsWith("03") || digits.startsWith("04") || 
      digits.startsWith("05") || digits.startsWith("06") || 
      digits.startsWith("07") || digits.startsWith("08") || 
      digits.startsWith("09")) {
    return digits.length >= 9 && digits.length <= 10;
  }
  
  return false;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate crypto wallet address (basic check)
 */
export function isValidCryptoWallet(wallet: string): boolean {
  // Ethereum/BSC
  if (/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return true;
  }
  // Bitcoin
  if (/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(wallet)) {
    return true;
  }
  // Bitcoin Bech32
  if (/^bc1[a-z0-9]{39,59}$/.test(wallet)) {
    return true;
  }
  return false;
}

/**
 * Validate Telegram username
 */
export function isValidTelegramUsername(username: string): boolean {
  // Remove @ if present
  const cleaned = username.startsWith("@") ? username.substring(1) : username;
  // Telegram usernames: 5-32 chars, alphanumeric + underscore
  return /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(cleaned);
}

/**
 * Validate data point based on type
 */
export function validateDataPoint(
  type: string,
  value: string
): { valid: boolean; error?: string } {
  if (!value || value.trim() === "") {
    return { valid: false, error: "Value is required" };
  }

  switch (type) {
    case "phone":
    case "whatsapp":
      if (!isValidMalaysianPhone(value)) {
        return { 
          valid: false, 
          error: "Please enter a valid Malaysian phone number" 
        };
      }
      break;
    case "email":
      if (!isValidEmail(value)) {
        return { valid: false, error: "Please enter a valid email address" };
      }
      break;
    case "website":
      if (!isValidUrl(value)) {
        return { valid: false, error: "Please enter a valid URL" };
      }
      break;
    case "crypto_wallet":
      if (!isValidCryptoWallet(value)) {
        return { 
          valid: false, 
          error: "Please enter a valid wallet address" 
        };
      }
      break;
    case "telegram":
      if (!isValidTelegramUsername(value)) {
        return { 
          valid: false, 
          error: "Please enter a valid Telegram username" 
        };
      }
      break;
  }

  return { valid: true };
}
