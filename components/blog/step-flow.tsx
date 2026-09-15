import type { BlogStep } from "@/lib/blog-data";
import { linkSitePaths } from "@/lib/inline-links";

/** Escapes authored text, links site paths, then turns **bold** into <strong>. */
function inlineBold(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return linkSitePaths(escaped).replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="text-foreground">$1</strong>'
  );
}

/**
 * A numbered step diagram for guides. Numbers are meaningful here: the steps
 * are an ordered sequence the reader follows.
 *
 * Phones get a vertical timeline (circles joined by a line down the left);
 * from `sm` up the steps sit side by side, joined by a line across the circles.
 */
export function StepFlow({
  steps,
  label,
}: {
  steps: BlogStep[];
  label?: string;
}) {
  if (steps.length === 0) return null;

  return (
    <figure className="my-6 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 sm:p-6">
      {label && (
        <figcaption className="mb-5 text-base font-bold text-foreground">
          {label}
        </figcaption>
      )}

      <ol
        className={`grid gap-0 sm:gap-5 ${
          steps.length === 3
            ? "sm:grid-cols-3"
            : steps.length === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-1"
        }`}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step.title}
              className="relative flex gap-4 pb-6 last:pb-0 sm:flex-col sm:gap-3 sm:pb-0"
            >
              {/* Connector: down the left on phones, across the circles from sm */}
              {!isLast && (
                <>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[17px] top-10 w-0.5 rounded-full bg-primary/25 sm:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-12 right-[-1.25rem] top-[17px] hidden h-0.5 rounded-full bg-primary/25 sm:block"
                  />
                </>
              )}

              <span
                aria-hidden="true"
                className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-[0_2px_6px_-1px_hsl(var(--primary)/0.45)]"
              >
                {index + 1}
              </span>

              <div className="min-w-0 pt-1 sm:pt-0">
                <p className="font-semibold leading-snug text-foreground">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed text-foreground/70"
                  dangerouslySetInnerHTML={{ __html: inlineBold(step.body) }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
