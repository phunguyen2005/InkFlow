import { Suspense } from "react";
import type { Metadata } from "next";
import { community } from "@/features/community/data/community";
import type { CommunityTabFilter } from "@/features/community/types/community";
import { LibraryShell } from "@/features/library/components/navigation/site-header";
import { CommunityHero } from "@/features/community/components/community-hero";
import { CommunityNav } from "@/features/community/components/community-nav";
import { FeaturedDiscussion } from "@/features/community/components/featured-discussion";
import { LatestConversations } from "@/features/community/components/latest-conversations";
import { WeeklyPrompt } from "@/features/community/components/weekly-prompt";
import { CommunityCTA } from "@/features/community/components/community-cta";

export const metadata: Metadata = {
  title: "Community · InkFlow",
  description:
    "Join the conversation. Discuss published stories, explore character choices, and connect with fellow readers.",
};

type Props = {
  searchParams: Promise<{ tab?: string; story?: string }>;
};

export default async function CommunityPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const rawTab =
    typeof resolvedParams.tab === "string"
      ? resolvedParams.tab.toLowerCase()
      : undefined;
  const storySlug =
    typeof resolvedParams.story === "string"
      ? resolvedParams.story
      : undefined;

  const activeTab: CommunityTabFilter =
    rawTab === "discussions" || rawTab === "reviews" ? rawTab : "all";

  const homeData = await community.getCommunityHome();
  const isDefaultView = activeTab === "all" && !storySlug;

  let discussions = homeData.latest;
  let sectionTitle = "Latest Conversations";

  if (!isDefaultView) {
    const listResult = await community.listDiscussions({
      tab: activeTab,
      storySlug,
      pageSize: 20,
    });
    discussions = listResult.items;

    if (storySlug) {
      const storyTitle = discussions[0]?.storyRef?.storyTitle ?? storySlug;
      sectionTitle = `Conversations · ${storyTitle}`;
    } else if (activeTab === "discussions") {
      sectionTitle = "Discussions";
    } else if (activeTab === "reviews") {
      sectionTitle = "Reader Reviews";
    }
  }

  return (
    <LibraryShell active="community">
      <main id="main" className="page-width community-page">
        <CommunityHero />
        <Suspense fallback={<div className="community-nav" />}>
          <CommunityNav />
        </Suspense>

        {isDefaultView && (
          <>
            {homeData.featured && (
              <FeaturedDiscussion discussion={homeData.featured} />
            )}
            <WeeklyPrompt prompt={homeData.prompt} />
          </>
        )}

        <LatestConversations
          discussions={discussions}
          title={sectionTitle}
        />

        <CommunityCTA />

        <p className="community-mock-notice">
          Mock editorial content. Does not represent real posts or interactions. All
          stories and discussions are fictional.
        </p>
      </main>
    </LibraryShell>
  );
}
