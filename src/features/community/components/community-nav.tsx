"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { CommunityTabFilter } from "../types/community";

interface TabItem {
  id: CommunityTabFilter;
  label: string;
  href: string;
}

const TABS: TabItem[] = [
  { id: "all", label: "All", href: "/community" },
  { id: "discussions", label: "Discussions", href: "/community?tab=discussions" },
  { id: "reviews", label: "Reviews", href: "/community?tab=reviews" },
];

export function CommunityNav() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab")?.toLowerCase();
  const activeTab: CommunityTabFilter =
    rawTab === "discussions" || rawTab === "reviews" ? rawTab : "all";

  return (
    <nav aria-label="Community categories" className="community-nav">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={`community-nav-tab ${isActive ? "active" : ""}`.trim()}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
