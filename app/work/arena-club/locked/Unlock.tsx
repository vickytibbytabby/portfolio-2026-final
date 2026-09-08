"use client";

import { useState } from "react";
import styles from "./locked.module.css";

export default function Unlock() {
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "wrong">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("checking");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      // A full page load, not router.replace: the browser is already sitting on
      // /work/arena-club (the middleware rewrote it under the same URL), so a
      // client-side navigation to that path is a no-op — the middleware never
      // re-runs and the button hangs on "Checking…" forever. This re-requests
      // the page, which is what makes the new cookie count.
      window.location.replace("/work/arena-club");
      return;
    }
    setState("wrong");
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <input
        className={styles.input}
        type="password"
        name="case-password"
        placeholder="Password"
        aria-label="Password"
        autoComplete="off"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (state === "wrong") setState("idle");
        }}
      />
      <button className={styles.button} type="submit" disabled={state === "checking"}>
        {state === "checking" ? "Checking…" : "Enter"}
      </button>
      <p className={styles.error} data-show={state === "wrong" || undefined} aria-live="polite">
        That isn&rsquo;t it — try again?
      </p>
    </form>
  );
}
