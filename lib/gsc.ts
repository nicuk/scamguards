// Google Search Console client, ported from TCGIntel (lib/gsc.ts there).
// Service-account auth with plain fetch + node:crypto, no SDK. Dormant-safe:
// without GSC_CLIENT_EMAIL + GSC_PRIVATE_KEY every function returns [] / null,
// so the site runs unchanged and the impressions figure is simply absent.
//
// SERVER-ONLY. node:crypto signs the service-account JWT; importing this into
// a client component fails the build.

import crypto from "node:crypto";

const CLIENT_EMAIL = process.env.GSC_CLIENT_EMAIL;
const PRIVATE_KEY_RAW = process.env.GSC_PRIVATE_KEY;
// The Search Console property id, which is not always a URL. A URL-prefix
// property is "https://scamguards.app/"; a Domain property is
// "sc-domain:scamguards.app". Asking for the wrong shape returns a 403 that
// looks exactly like a missing permission, so set GSC_SITE_URL to the exact
// form shown in Search Console if the default does not match.
const SITE_URL = process.env.GSC_SITE_URL || "sc-domain:scamguards.app";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export function gscConfigured(): boolean {
  return Boolean(CLIENT_EMAIL && PRIVATE_KEY_RAW);
}

/**
 * Env-stored PEM keys arrive mangled in several predictable ways. Normalize all of them to a real
 * PEM so crypto.sign accepts it.
 *
 * Production was failing on exactly this: `error:1E08010C:DECODER routines::unsupported`, every day
 * since the key was set, on both the sponsor-board impressions figure.
 * OpenSSL's decoder error means "this is not a PEM I can parse" and says nothing about why, so the
 * cheap defence is to strip the things that get pasted in alongside the key.
 *
 * Handled, in order:
 *   • surrounding quotes — the Vercel/`.env` UI keeps `"…"` or `'…'` as part of the VALUE, so the
 *     first character OpenSSL sees is a quote rather than a dash. This is the most common cause.
 *   • literal "\n" — single-line env vars escape their newlines.
 *   • CRLF — a key pasted through a Windows clipboard carries \r, which PEM parsers reject.
 *   • stray leading/trailing whitespace.
 *
 * Deliberately NOT handled: a key with its BEGIN/END armour missing, or a PKCS#1 body labelled as
 * PKCS#8. Those are genuinely different keys, and silently reshaping them would turn a clear failure
 * into a mysterious one. `describeKeyProblem` names them instead.
 */
export function normalizePrivateKey(raw: string | undefined): string {
  let key = (raw ?? "").trim();
  if (key.length >= 2 && ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'")))) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, "\n").replace(/\r/g, "").trim();
}

/**
 * A human diagnosis of an unusable key, or null when it looks structurally fine.
 *
 * The value of this is entirely in the error message: "DECODER routines::unsupported" sent whoever
 * set this up looking at the wrong thing for three days. Pure, so it is testable without a key.
 */
export function describeKeyProblem(raw: string | undefined): string | null {
  const key = normalizePrivateKey(raw);
  if (!key) return "GSC_PRIVATE_KEY is empty";
  if (!key.includes("-----BEGIN")) {
    return "GSC_PRIVATE_KEY has no -----BEGIN line — it looks truncated, or the armour was dropped when pasting";
  }
  if (!key.includes("-----END")) return "GSC_PRIVATE_KEY has no -----END line — it looks truncated";
  if (!/-----BEGIN (RSA )?PRIVATE KEY-----/.test(key)) {
    return "GSC_PRIVATE_KEY is not a private key — check you copied `private_key` from the service-account JSON, not a certificate";
  }
  if (!key.includes("\n")) {
    return "GSC_PRIVATE_KEY is all on one line with no real newlines — a PEM needs line breaks (store the literal \\n sequences, which we expand)";
  }
  return null;
}

function privateKey(): string {
  return normalizePrivateKey(PRIVATE_KEY_RAW);
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Build + RS256-sign the service-account JWT assertion used to mint an access token. */
export function buildAssertion(email: string, key: string, now = Math.floor(Date.now() / 1000)): string {
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64url(
    JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }),
  );
  const signingInput = `${header}.${claim}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), key);
  return `${signingInput}.${base64url(signature)}`;
}

/**
 * Why the last call came back empty.
 *
 * Every function here is dormant-safe: it returns [] or null rather than throwing, so a missing
 * credential cannot take a page down. The cost is that "not configured", "key rejected", "no
 * permission on the property" and "genuinely no data" all look identical from the outside — four
 * different problems with four different fixes, and no way to tell which one you have.
 *
 * So the reason is recorded on the way past. Nothing changes about the return values.
 */
let lastError: string | null = null;

/** The recorded reason, or null if the last call succeeded. */
export function lastGscError(): string | null {
  return lastError;
}

let cachedToken: { token: string; exp: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (!CLIENT_EMAIL || !PRIVATE_KEY_RAW) {
    const missing = [!CLIENT_EMAIL && "GSC_CLIENT_EMAIL", !PRIVATE_KEY_RAW && "GSC_PRIVATE_KEY"]
      .filter(Boolean)
      .join(" + ");
    lastError = `not configured: ${missing} is not set`;
    return null;
  }
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;
  try {
    const assertion = buildAssertion(CLIENT_EMAIL, privateKey(), now);
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
    });
    if (!res.ok) {
      // Google names the problem here and it is worth repeating verbatim: "invalid_grant" is a bad
      // or revoked key, "invalid_client" a client_email that does not exist.
      lastError = `token endpoint rejected ${res.status}: ${(await res.text()).slice(0, 200)}`;
      return null;
    }
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) {
      lastError = "token endpoint returned no access_token";
      return null;
    }
    cachedToken = { token: json.access_token, exp: now + (json.expires_in ?? 3600) };
    return json.access_token;
  } catch (err) {
    // Almost always a malformed PEM: the key pasted with its wrapping quotes kept, or with its
    // escaped newlines flattened, so crypto.sign cannot parse it. Lead with the STRUCTURAL
    // diagnosis where we have one — OpenSSL's "DECODER routines::unsupported" is true and useless,
    // and it sent whoever set this up looking in the wrong place for three days.
    const diagnosis = describeKeyProblem(PRIVATE_KEY_RAW);
    lastError = `could not sign the assertion — ${
      diagnosis ?? "the key parsed as a PEM but OpenSSL rejected it; check it is the service account's current key"
    } (openssl: ${err instanceof Error ? err.message : String(err)})`;
    return null;
  }
}

export type GscRow = {
  keys: string[]; // one per requested dimension (e.g. [query] or [page])
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

/** Query Search Analytics. Returns [] when unconfigured or on any error (never throws). */
export async function querySearchAnalytics(opts: {
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  dimensions: ("query" | "page" | "date")[];
  rowLimit?: number;
}): Promise<GscRow[]> {
  const token = await getAccessToken();
  if (!token) return [];
  try {
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_URL)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({
          startDate: opts.startDate,
          endDate: opts.endDate,
          dimensions: opts.dimensions,
          rowLimit: opts.rowLimit ?? 250,
        }),
      },
    );
    if (!res.ok) {
      // 403 is the classic one: the credential is fine but SITE_URL does not name a property this
      // service account can read — either it was never added under Users and permissions, or the
      // property is a Domain one (`sc-domain:scamguards.app`) and this is asking for the URL-prefix
      // form. Both produce an identical silent empty result without this line.
      const hint =
        res.status === 403
          ? ` — check ${CLIENT_EMAIL ?? "the service account"} is added to the "${SITE_URL}" property in Search Console, and that GSC_SITE_URL matches its exact form`
          : "";
      lastError = `Search Analytics rejected ${res.status}${hint}: ${(await res.text()).slice(0, 200)}`;
      return [];
    }
    const json = (await res.json()) as { rows?: GscRow[] };
    lastError = json.rows?.length
      ? null
      : "authenticated fine, but the property returned no rows for that date range";
    return json.rows ?? [];
  } catch (err) {
    lastError = `Search Analytics fetch failed: ${err instanceof Error ? err.message : String(err)}`;
    return [];
  }
}

/** yyyy-mm-dd for `daysAgo` days before `from` (default now), UTC. */
export function daysAgo(days: number, from = new Date()): string {
  const d = new Date(from.getTime() - days * 86_400_000);
  return d.toISOString().slice(0, 10);
}
