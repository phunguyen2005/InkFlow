"use client";

import Link from "next/link";
import { useState } from "react";
import { BookMarked, ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAccount } from "./account-provider";

export function AccountMenu() {
  const { ready, state, signOut } = useAccount();
  const [open, setOpen] = useState(false);
  if (!ready)
    return <span className="account-placeholder" aria-hidden="true" />;
  const handleAuthNav = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  if (!state.profile) {
    return (
      <div className="guest-actions">
        <Link className="header-signin-btn" href="/sign-in" onClick={handleAuthNav}>
          Sign in
        </Link>
        <Link className="header-getstarted-btn" href="/sign-up" onClick={handleAuthNav}>
          Get started
        </Link>
      </div>
    );
  }
  const initial = state.profile.name.trim().charAt(0).toUpperCase() || "R";
  return (
    <div className="account-menu">
      <button
        className="account-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="account-avatar">{initial}</span>
        <span>{state.profile.name}</span>
        <ChevronDown size={14} />
      </button>
      {open ? (
        <div className="account-popover" role="menu">
          <p>{state.profile.email}</p>
          <Link role="menuitem" href="/library" onClick={() => setOpen(false)}>
            <BookMarked size={16} /> My Library
          </Link>
          <Link role="menuitem" href="/about" onClick={() => setOpen(false)}>
            <UserRound size={16} /> About InkFlow
          </Link>
          <button
            role="menuitem"
            onClick={() => {
              signOut();
              setOpen(false);
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
