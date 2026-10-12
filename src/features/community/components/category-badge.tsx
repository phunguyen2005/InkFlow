import type { DiscussionCategory } from "../types/community";

const CATEGORY_META: Record<
  DiscussionCategory,
  { label: string; modifier: string }
> = {
  CHARACTER_DISCUSSION: {
    label: "Character Discussion",
    modifier: "category-badge-character",
  },
  READER_REVIEW: {
    label: "Reader Review",
    modifier: "category-badge-review",
  },
  WORLD_AND_LORE: {
    label: "World & Lore",
    modifier: "category-badge-lore",
  },
  THEORY_AND_PREDICTION: {
    label: "Theory & Prediction",
    modifier: "category-badge-theory",
  },
  GENERAL: {
    label: "General",
    modifier: "category-badge-general",
  },
};

export function CategoryBadge({
  category,
  className = "",
}: {
  category: DiscussionCategory;
  className?: string;
}) {
  const meta = CATEGORY_META[category] ?? {
    label: category,
    modifier: "category-badge-general",
  };

  return (
    <span className={`category-badge ${meta.modifier} ${className}`.trim()}>
      {meta.label}
    </span>
  );
}
