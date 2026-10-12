"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { useAccount } from "./account-provider";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const { signIn } = useAccount();
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [mode]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const name = String(data.get("name") ?? "Reader").trim() || "Reader";
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Enter a valid email address.");
      return;
    }
    signIn({ name, email });
    router.push("/library");
  }
  const isSignUp = mode === "sign-up";
  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <span className="eyebrow coral">Reader account</span>
      <h1>{isSignUp ? "Begin your next chapter." : "Welcome back."}</h1>
      <p>
        {isSignUp
          ? "Create a local preview profile for saved stories and reading progress."
          : "Return to your saved stories and continue where you stopped."}
      </p>
      {isSignUp ? (
        <label>
          Display name
          <input name="name" autoComplete="name" required maxLength={60} />
        </label>
      ) : null}
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={isSignUp ? "new-password" : "current-password"}
          minLength={8}
          required
        />
      </label>
      <button className="button" type="submit">
        {isSignUp ? "Create account" : "Sign in"} <ArrowRight size={17} />
      </button>
      <span className="auth-message" role="alert">
        {message}
      </span>
      <p className="auth-switch">
        {isSignUp ? "Already have a profile?" : "New to InkFlow?"}{" "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
      <p className="fine-print">
        Preview account data stays in this browser. No credentials are sent to a
        server.
      </p>
    </form>
  );
}
