/**
 * Lightweight browser fingerprint for reporter identity.
 * Not PII — just a hash of browser characteristics.
 * Used to activate reporter_reputation and moderation_queue triggers.
 */
export async function generateReporterHash(): Promise<string> {
  const components = [
    navigator.language,
    screen.width + "x" + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
    navigator.userAgent.replace(/[\d.]+/g, "X"), // strip version numbers
  ];

  const raw = components.join("|");

  // Use SubtleCrypto for a proper hash (available in all modern browsers)
  const encoder = new TextEncoder();
  const data = encoder.encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "rh_" + hashArray.slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}
