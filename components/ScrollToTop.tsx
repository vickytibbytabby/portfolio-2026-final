"use client";

import { useLayoutEffect } from "react";

/**
 * Starts a case study at the top, whichever way you arrived.
 *
 * Two things push you down the page otherwise. The browser restores your last
 * position on a reload or a back-navigation, which on a case study lands you
 * somewhere under the hero. And `scroll-behavior: smooth` is set sitewide, so
 * the scroll-to-top a route change performs is an *animation* — anything that
 * interrupts it (the transition veil lifting, a flick of the trackpad) leaves
 * it parked halfway.
 *
 * So: take scroll restoration off the browser while a study is mounted, and
 * jump — not glide — to the top.
 */
export default function ScrollToTop() {
  useLayoutEffect(() => {
    const previous = history.scrollRestoration;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const top = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    top();
    // Chrome can restore the old position after load, which would beat the line
    // above; this puts it back.
    window.addEventListener("load", top);

    return () => {
      window.removeEventListener("load", top);
      if ("scrollRestoration" in history) history.scrollRestoration = previous;
    };
  }, []);

  return null;
}
