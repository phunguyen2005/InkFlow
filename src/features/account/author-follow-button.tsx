"use client";

import { Check, UserPlus } from "lucide-react";
import { useAccount } from "./account-provider";

export function AuthorFollowButton({ authorId }: { authorId: string }) {
  const { state, toggle } = useAccount();
  const following = state.followedAuthorIds.includes(authorId);
  return (
    <button
      className="button button-outline author-follow"
      aria-pressed={following}
      onClick={() => toggle("followedAuthorIds", authorId)}
    >
      {following ? <Check size={17} /> : <UserPlus size={17} />}
      {following ? "Following" : "Follow author"}
    </button>
  );
}
