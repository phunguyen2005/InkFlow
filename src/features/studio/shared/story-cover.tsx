import Image from "next/image";
import type { StudioStory } from "../data/contracts";
import s from "./studio.module.css";
export function Cover({ story }: { story: StudioStory }) {
  return (
    <div className={s.cover}>
      {story.cover ? (
        <Image
          src={story.cover}
          alt={`${story.title} cover illustration`}
          fill
          sizes="130px"
        />
      ) : (
        <span className={s.coverFallback}>{story.title.slice(0, 1)}</span>
      )}
    </div>
  );
}
