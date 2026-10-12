"use client";
import { useState, useRef, useCallback, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Feather,
  LayoutDashboard,
  Library,
  Menu,
  PanelsTopLeft,
  ShieldCheck,
  X,
  ChevronDown,
} from "lucide-react";
import { useStudio } from "./studio-provider";
import { StudioLink } from "./studio-link";
import s from "./studio.module.css";
import { usePanelFocus } from "./use-panel-focus";

export function StudioShell({ children }: { children: ReactNode }) {
  const { state, beforeNavigate } = useStudio();
  const path = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const rail = useRef<HTMLElement>(null);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  usePanelFocus(drawer, rail, closeDrawer);
  const story = state.stories.find((item) =>
    path.includes(`/stories/${item.id}`),
  );
  const editor = path.includes("/chapters/") || path.endsWith("/assistant");
  const routes = [
    { href: "/studio", label: "Your stories", icon: LayoutDashboard },
    {
      href: story ? `/studio/stories/${story.id}` : "/studio",
      label: "Story workspace",
      icon: BookOpen,
    },
    {
      href: story ? `/studio/stories/${story.id}/canon` : "/studio",
      label: "Canon library",
      icon: Library,
    },
    {
      href: story ? `/studio/stories/${story.id}/review` : "/studio",
      label: "Continuity review",
      icon: ShieldCheck,
    },
  ];
  return (
    <div className={s.root} data-studio-root>
      <aside
        ref={rail}
        className={`${s.rail} ${drawer ? s.railOpen : ""}`}
        aria-label="Studio navigation"
      >
        <StudioLink className={s.railBrand} href="/studio" title="Studio home">
          <Feather size={24} />
          <span>InkFlow Studio</span>
        </StudioLink>
        <nav>
          {routes.map(({ href, label, icon: Icon }, index) => (
            <StudioLink
              key={label}
              href={href}
              className={
                (index === 0 ? path === href : !!story && path === href)
                  ? s.railActive
                  : ""
              }
              aria-label={label}
              title={label}
              onClick={() => setDrawer(false)}
            >
              <Icon size={21} />
              <span>{label}</span>
            </StudioLink>
          ))}
        </nav>
        <StudioLink href="/" title="Public Library" aria-label="Public Library">
          <PanelsTopLeft size={21} />
          <span>Public Library</span>
        </StudioLink>
        <span className={s.avatar} title="Local author workspace">
          MV
        </span>
        <button
          className={s.closeRail}
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        >
          <X size={20} />
        </button>
      </aside>
      {drawer && (
        <button
          className={s.scrim}
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        />
      )}
      <div className={s.shell}>
        <header className={s.topbar}>
          <button
            className={s.mobileMenu}
            aria-label="Open navigation"
            onClick={() => setDrawer(true)}
          >
            <Menu size={20} />
          </button>
          <StudioLink href="/studio" className={s.wordmark}>
            InkFlow<span>.</span> <small>Studio</small>
          </StudioLink>
          <span className={s.divider} />
          {story ? (
            <label className={s.storySwitcher}>
              <span className={s.srOnly}>Switch story</span>
              <select
                aria-label="Switch story"
                value={story.id}
                onChange={async (event) => {
                  const id = event.target.value;
                  if (await beforeNavigate())
                    router.push(`/studio/stories/${id}`);
                }}
              >
                {state.stories
                  .filter((item) => !item.archived)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
              </select>
              <ChevronDown size={14} />
            </label>
          ) : (
            <span className={s.topbarSubtitle}>
              A focused space for endless worlds
            </span>
          )}
          <span className={s.localTag}>
            <span />
            Local workspace
          </span>
        </header>
        {!editor && story && (
          <nav className={s.storyNav} aria-label="Story sections">
            {routes.slice(1).map(({ href, label }) => (
              <StudioLink
                href={href}
                key={href}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
              </StudioLink>
            ))}
          </nav>
        )}
        {children}
      </div>
    </div>
  );
}
