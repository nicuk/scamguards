import { SITE_URL } from "@/lib/seo-config";

// IndexNow tells Bing (and Yandex, Seznam, Naver) about new or changed URLs
// straight away instead of waiting for the next sitemap read. Bing sends most
// of ScamGuards' search traffic, so this matters more here than Google, which
// does not take part in IndexNow.
//
// The key is public by design: engines prove ownership by fetching
// /<key>.txt from the site, so it must match public/<key>.txt exactly.

export const INDEXNOW_KEY = "951f8623763fa037277bf37bb795b143";

const ENDPOINT = "https://api.indexnow.org/indexnow";
// Protocol limit per request.
const MAX_URLS_PER_REQUEST = 10_000;

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
}

/**
 * Submit URLs on this site. 200 and 202 both mean accepted (202: key not yet
 * validated, the engine will fetch the key file). Never throws: a failed ping
 * must not break the caller, and the URLs are still in the sitemap.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const host = new URL(SITE_URL).host;
  const urlList = Array.from(new Set(urls)).filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });

  if (urlList.length === 0) return { ok: true, status: 204, submitted: 0 };

  let submitted = 0;
  for (let i = 0; i < urlList.length; i += MAX_URLS_PER_REQUEST) {
    const batch = urlList.slice(i, i + MAX_URLS_PER_REQUEST);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host,
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        }),
        cache: "no-store",
      });
      if (response.status !== 200 && response.status !== 202) {
        console.error(
          `[indexnow] rejected with ${response.status}: ${(await response.text()).slice(0, 200)}`
        );
        return { ok: false, status: response.status, submitted };
      }
      submitted += batch.length;
    } catch (err) {
      console.error("[indexnow] request failed:", err);
      return { ok: false, status: 0, submitted };
    }
  }

  return { ok: true, status: 200, submitted };
}
