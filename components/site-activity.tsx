"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

// First-party visitor counting, as on the TCGIntel sponsor board.
//
// One beacon in the root layout records the visit on every public page, so the
// figure covers the whole site rather than only pages that render the sponsor
// panel. Anything displaying the figure subscribes to the store below instead
// of sending a request of its own.

type VisitorWindow = { visitors: number | null; days: number | null };

const EMPTY: VisitorWindow = { visitors: null, days: null };
let state: VisitorWindow = EMPTY;
const listeners = new Set<() => void>();

function publish(next: VisitorWindow) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const SESSION_KEY = "sg:visit-counted";

function sessionStore(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null; // private mode or blocked storage: the cookie still dedupes
  }
}

export function SiteActivityBeacon() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (isAdmin) return;
    const store = sessionStore();
    if (store?.getItem(SESSION_KEY)) return;
    // Claim the session before the request, so two racing mounts (strict mode,
    // a second tab) cannot both increment. The server cookie is the backstop.
    store?.setItem(SESSION_KEY, "1");

    // Deliberately no unmount guard. The result goes to the module store, which
    // outlives this component, and the request fires once per session:
    // discarding its answer on unmount (React's dev double-mount, or a fast
    // navigation) would lose the only reply the session will get.
    fetch("/api/visit", { method: "POST" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: VisitorWindow | null) => {
        if (typeof data?.visitors === "number") {
          publish({ visitors: data.visitors, days: data.days ?? null });
        }
      })
      .catch(() => {});
  }, [isAdmin]);

  return null;
}

/**
 * The live figure once the beacon has reported, the server-rendered one until
 * then. The server snapshot is empty, so the first client render matches the
 * server render exactly and there is no hydration mismatch.
 */
export function useVisitorWindow(server: VisitorWindow): VisitorWindow {
  const live = useSyncExternalStore(
    subscribe,
    () => state,
    () => EMPTY
  );

  return live.visitors !== null ? live : server;
}
