// Older guides name the report and check pages as plain text
// ("go to scamguards.app/submit"), which a reader on a phone can't tap. This
// turns those mentions into links wherever article text is rendered.

export const INLINE_LINK_CLASS =
  "font-medium text-primary underline underline-offset-2 hover:no-underline";

/**
 * Link bare mentions of scamguards.app/submit, /search and /dispute to the
 * page. Run it on authored text before any other inline formatting. It skips
 * a mention that is already a markdown link label ("[scamguards.app/submit](/submit)")
 * or part of a longer URL ("https://scamguards.app/search").
 */
export function linkSitePaths(text: string): string {
  return text.replace(
    /(?<![[\w./-])scamguards\.app\/(submit|search|dispute)(?![\w\]/-])/g,
    (_match, path) =>
      `<a href="/${path}" class="${INLINE_LINK_CLASS}">scamguards.app/${path}</a>`
  );
}
