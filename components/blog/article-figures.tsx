import Image from "next/image";
import type { BlogFigure } from "@/lib/blog-data";

/**
 * Phone screenshots under a guide section. Each is framed at phone width so a
 * tall capture reads as "this is what your screen looks like" rather than
 * stretching across the article; pairs sit side by side from `sm` up.
 */
export function ArticleFigures({ figures }: { figures: BlogFigure[] }) {
  if (figures.length === 0) return null;

  return (
    <div
      className={`my-6 grid items-start gap-6 ${
        figures.length > 1 ? "sm:grid-cols-2" : ""
      }`}
    >
      {figures.map((figure) => (
        <figure key={figure.src} className="mx-auto w-full max-w-[320px]">
          <div className="overflow-hidden rounded-2xl border bg-background shadow-[0_6px_20px_-12px_hsl(222_47%_11%/0.35)]">
            <Image
              src={figure.src}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              sizes="(min-width: 640px) 320px, 90vw"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="mt-2.5 text-center text-sm leading-snug text-muted-foreground">
            {figure.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
