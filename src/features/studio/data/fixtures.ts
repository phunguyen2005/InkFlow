import type { JSONContent } from "@tiptap/core";
import type { StudioSnapshot, EntityType, EvidenceAnchor } from "./contracts";
import { emptyIntelligence } from "../intelligence/contracts";

const stamp = "2026-10-11T08:00:00.000Z";
const titles = [
  "The Arrival",
  "The Red Garden",
  "A Forgotten Name",
  "The Broken Vow",
  "Whispers in the Fog",
  "The Unopened Letter",
  "A House of Borrowed Names",
  "The River Door",
  "What the Archivist Kept",
  "The Warden's Debt",
  "A Winter Without Bells",
  "The Shattered Key",
  "A Smaller Kind of Courage",
  "Names Beneath the Water",
  "The Ivory Ledger",
  "The Last Orchard Keeper",
  "An Offer at Dusk",
  "A Different Allegiance",
  "The Price of Passage",
  "The Silver Monk",
  "In the House of Witnesses",
  "A Map of All We Lost",
  "The Unspoken Treaty",
  "Salt and Pomegranate",
  "The Lantern Procession",
  "A Promise Reconsidered",
  "The Names We Choose",
  "When the Garden Opens",
  "Before the First Morning",
  "A Place to Begin Again",
];
export function makeDocument(
  paragraphs: string[],
  prefix: string,
): JSONContent {
  return {
    type: "doc",
    content: paragraphs.map((text, index) => ({
      type: "paragraph",
      attrs: { id: `${prefix}-block-${index + 1}` },
      content: text ? [{ type: "text", text }] : undefined,
    })),
  };
}
const opening = [
  "The orchard had been silent for thirteen years. Elara stood beneath the ancient trees, where the last light of evening traced the ruins of a kingdom that no longer remembered its own name.",
  "Somewhere beyond the garden walls, a bell began to ring. She had heard that sound before, but never from a tower that had been empty since the winter of her childhood.",
  "Elara drew the Ashen Key from her pocket. Its narrow silver teeth were intact, and the cold metal warmed when she spoke her mother's name.",
  "Kael waited beside the southern gate of the Red Orchard. He had promised not to follow her, but his silhouette remained between the two weathered stone pillars.",
  "She turned the letter over. There was no signature, only the outline of a flower pressed so hard into the paper that its veins showed on the other side.",
  "The Warden had warned her about names. Names were doors, he had said, and every door required someone to stand on the other side. Elara had laughed then. Now she kept the letter folded beneath her sleeve.",
  "Seraphine belonged to the Hollow Church. The archivist knew the names of every family buried beneath the orchard and the names of three families that had not yet arrived.",
  "The girl beneath the branches was not a ghost. She left footprints in the pale dust, and when she looked back at Elara, her expression was neither fear nor recognition.",
  "For the first time since returning home, Elara decided to ask a question without knowing what the answer would cost. She stepped forward and let the folded letter fall open.",
];
const passages = [
  "The narrow passage smelled of rain and old paper. A lamp burned at the foot of the stairs, although nobody in the house admitted to lighting it. Elara paused beside the door, listening for the familiar scrape of a chair. The room beyond was quiet. She set her notebook on the table and drew a line beneath the last entry, leaving space for the answer she had not yet found.",
  "Kael spread the map between two cups of cooling tea. The river crossed the page twice, once in ink and once as a pale scar left by a careful erasure. They traced its course without speaking. Outside, the street returned to its ordinary evening sounds: a shutter closing, a cart on wet stone, someone calling a name that belonged to neither of them.",
  "Seraphine did not offer an explanation immediately. She took a small book from the shelf, opened it at a page marked with blue thread, and turned it toward the window. In the clean light, the missing line became visible. It was a promise written before any of them had been born, and it had been amended more than once.",
  "They rested beside the garden wall until the wind changed. Elara counted the tools in her bag and checked the binding of her notebook. Nothing miraculous had happened. Nobody had won the argument. But the path they had chosen was now visible, and for that evening visibility was enough. She rose first, holding out her hand so the others could follow.",
];
const genrePassages: Record<string, string[]> = {
  "axiom-drift": [
    "Commander Iona Vale watched the unbuilt station resolve on the navigation display. The beacon carried tomorrow's timestamp. She disconnected the autopilot and asked the crew to record what they could see with their own eyes.",
    "Axiom's engineer found a second course hidden beneath the first. Following it would bring them home three hours before departure. Iona marked the coordinates as unverified and kept the engines at idle.",
  ],
  "glass-witness": [
    "Detective Lena Saye placed the broken window on a sheet of black cloth. In its largest fragment, the cafe clock read eleven seventeen. The witness had been reported missing at eleven, and somebody had carefully removed that detail from the statement.",
    "The reflection showed a blue umbrella where the photograph showed an empty chair. Lena returned to the cafe with both images. She asked the proprietor about the chair first, giving him room to tell a different story.",
  ],
  "letters-midnight": [
    "Maya left the envelope beneath the cafe's locked door after midnight. She wrote about the train she had missed and the book she had finished. By morning, a reply waited under the brass letterbox, signed only with an ink-stained question mark.",
    "Noah read the letter twice before answering. He had walked past the closed cafe for a year without noticing the handwritten menu. Now he stopped at its window every evening, trying to imagine the person who had asked whether a city could feel like home before anyone knew your name.",
  ],
};
const genreTitles: Record<string, string[]> = {
  "axiom-drift": [
    "Departure Vector",
    "Station Null",
    "The Unbuilt Dock",
    "A Route Home",
  ],
  "glass-witness": [
    "A Broken Window",
    "The Missing Hour",
    "Glass Testimony",
    "The Last Reflection",
  ],
  "letters-midnight": [
    "A Closed Cafe",
    "The First Letter",
    "After Midnight",
    "A Name in the Margin",
  ],
};
export function seedStudio(): StudioSnapshot {
  const state: StudioSnapshot = {
    version: 2,
    intelligence: emptyIntelligence(),
    stories: [],
    chapters: [],
    entities: [],
    facts: [],
    issues: [],
  };
  const projects = [
    [
      "blood-orchard",
      "The Blood Orchard",
      "Dark Fantasy",
      "An orchard that remembers. A bloodline that should be forgotten. Elara returns to the estate that erased her name, carrying a letter addressed to someone who never existed.",
      "/mock/covers/the-blood-orchard.webp",
    ],
    [
      "axiom-drift",
      "Axiom Drift",
      "Science Fiction",
      "A navigation officer finds a route to a station that has not been built yet. Every correction brings its arrival one day closer.",
      "/studio/art/axiom-drift.webp",
    ],
    [
      "glass-witness",
      "The Glass Witness",
      "Mystery / Thriller",
      "An investigator reconstructs a vanished witness's final evening from the reflections in a broken window.",
      "/studio/art/the-glass-witness.webp",
    ],
    [
      "letters-midnight",
      "Letters After Midnight",
      "Contemporary Romance",
      "Two strangers exchange letters through a closed cafe, agreeing never to ask who is on the other side.",
      "/studio/art/letters-after-midnight.webp",
    ],
  ];
  for (const [key, title, genre, synopsis, cover] of projects) {
    const storyId = `story-${key}`;
    state.stories.push({
      id: storyId,
      title,
      genre,
      synopsis,
      cover,
      archived: false,
      updatedAt: stamp,
      lastChapterId: `${key}-ch-03`,
    });
    for (
      let number = 1;
      number <= (key === "blood-orchard" ? 30 : 4);
      number++
    ) {
      let paragraphs =
        key === "blood-orchard" && number === 3
          ? opening
          : [
              `${title}: ${titles[number - 1]}. ${passages[number % 4]}`,
              ...passages,
            ];
      if (key === "blood-orchard" && number === 1)
        paragraphs = [
          "The Red Orchard stood north of the city. Its walls caught the first light while the streets below remained in shadow.",
          ...passages,
        ];
      if (key === "blood-orchard" && number === 13)
        paragraphs = [
          "Elara drew the intact Ashen Key from her pocket and opened the gate, although she had watched it shatter the evening before.",
          ...passages,
        ];
      if (key === "blood-orchard" && number === 12)
        paragraphs = [
          "The Ashen Key shattered against the stone. Elara gathered its broken teeth into a cloth and knew the orchard gate would never open in the same way again.",
          ...passages,
        ];
      if (key === "blood-orchard" && number === 18)
        paragraphs = [
          "Seraphine left the Hollow Church and pledged her allegiance to the River Assembly. She placed her old seal on the table and did not look back.",
          ...passages,
        ];
      if (key === "blood-orchard" && number === 20)
        paragraphs = [
          "A stranger introduced himself as the Silver Monk. Elara recorded his name but made no promise to trust it.",
          ...passages,
        ];
      if (key === "blood-orchard" && number === 21)
        paragraphs = Array.from(
          { length: 96 },
          (_, index) => `Entry ${index + 1}. ${passages[index % 4]}`,
        );
      const id = `${key}-ch-${String(number).padStart(2, "0")}`;
      if (genrePassages[key]) paragraphs = genrePassages[key];
      state.chapters.push({
        id,
        storyId,
        title: genreTitles[key]?.[number - 1] ?? titles[number - 1],
        order: number,
        document: makeDocument(paragraphs, id),
        revision: 1,
        updatedAt: stamp,
        status: number === 3 ? "IN_PROGRESS" : "DRAFT",
        beats:
          "Arrival at the estate\nA familiar detail no longer fits\nA choice with an unexpected cost",
      });
    }
  }
  const names = [
    "Elara Voss",
    "Kael Draven",
    "Seraphine",
    "The Warden",
    "Lysarion",
    "Mother Selene",
    "The Red Orchard",
    "The River Door",
    "Ivory Archive",
    "South Gate",
    "Hollow Church",
    "River Assembly",
    "House Veyne",
    "Ashen Key",
    "Ivory Ledger",
    "Warden's Seal",
    "Namebinding",
    "The Cost of Passage",
    "Winter Silence",
    "Lantern Procession",
  ];
  const types: EntityType[] = [
    ...Array<EntityType>(6).fill("CHARACTER"),
    ...Array<EntityType>(4).fill("LOCATION"),
    ...Array<EntityType>(3).fill("FACTION"),
    ...Array<EntityType>(3).fill("ARTIFACT"),
    "POWER_SYSTEM",
    "RULE",
    "EVENT",
    "EVENT",
  ];
  const portraits = ["elara-voss", "kael-draven", "seraphine", "the-warden"];
  names.forEach((name, index) =>
    state.entities.push({
      id: `entity-${index + 1}`,
      storyId: "story-blood-orchard",
      name,
      type: types[index],
      aliases: [],
      summary:
        index < 6
          ? "A keeper of difficult promises. Their part in the orchard's history is still unfolding."
          : "A thread in the history of the orchard, recorded through the people who encountered it.",
      portrait: index < 4 ? `/studio/art/${portraits[index]}.webp` : undefined,
      relations:
        index === 0 ? [{ label: "travels with", targetId: "entity-2" }] : [],
    }),
  );
  const anchor = (
    number: number,
    block: number,
    excerpt?: string,
  ): EvidenceAnchor => {
    const chapter = state.chapters.find(
      (item) =>
        item.id === `blood-orchard-ch-${String(number).padStart(2, "0")}`,
    )!;
    return {
      chapterId: chapter.id,
      blockId: `${chapter.id}-block-${block}`,
      revision: 1,
      excerpt:
        excerpt ??
        chapter.document.content?.[block - 1].content?.[0].text ??
        "",
    };
  };
  names.forEach((name, index) => {
    for (let factNumber = 0; factNumber < 2; factNumber++)
      state.facts.push({
        id: `fact-${index * 2 + factNumber + 1}`,
        storyId: "story-blood-orchard",
        entityId: `entity-${index + 1}`,
        attribute: factNumber ? "First recorded" : "Role",
        value: factNumber
          ? "Chapter 1"
          : index < 6
            ? [
                "Protagonist",
                "Companion",
                "Archivist",
                "Antagonist",
                "Supporting witness",
                "Supporting witness",
              ][index]
            : `Recorded ${types[index].toLowerCase().replaceAll("_", " ")}`,
        fromChapterId: "blood-orchard-ch-01",
        untilChapterId: null,
        source: null,
        status: "CONFIRMED",
        replacesFactId: null,
        createdAt: stamp,
        decidedAt: stamp,
      });
  });
  Object.assign(state.facts[26], {
    attribute: "Condition",
    value: "Intact",
    untilChapterId: "blood-orchard-ch-12",
    source: anchor(3, 3),
  });
  Object.assign(state.facts[27], {
    attribute: "Condition",
    value: "Destroyed",
    fromChapterId: "blood-orchard-ch-12",
    source: anchor(12, 1),
  });
  Object.assign(state.facts[4], {
    attribute: "Affiliation",
    value: "Hollow Church",
    untilChapterId: "blood-orchard-ch-18",
    source: anchor(3, 7),
  });
  Object.assign(state.facts[5], {
    attribute: "Affiliation",
    value: "River Assembly",
    fromChapterId: "blood-orchard-ch-18",
    source: anchor(18, 1),
  });
  Object.assign(state.facts[12], {
    attribute: "Position",
    value: "North of the city",
    source: anchor(1, 1),
  });
  const proposals = [
    "Can hear names in the orchard",
    "Keeps a river map",
    "Carries the blue-thread ledger",
    "Former gatekeeper",
    "Known as the Silver Monk",
    "Passage requires a spoken name",
  ];
  proposals.forEach((value, index) =>
    state.facts.push({
      id: `proposal-${index + 1}`,
      storyId: "story-blood-orchard",
      entityId: `entity-${index + 1}`,
      attribute: "Observation",
      value,
      fromChapterId:
        index === 4 ? "blood-orchard-ch-20" : "blood-orchard-ch-03",
      untilChapterId: null,
      source: index === 4 ? anchor(20, 1) : anchor(3, index + 1),
      status: index === 5 ? "CONFIRMED" : "PROPOSED",
      replacesFactId: null,
      createdAt: stamp,
      decidedAt: index === 5 ? stamp : null,
    }),
  );
  const issueTitles = [
    "The key returns after its destruction",
    "The orchard gate changes direction",
    "A new name without a source",
    "Affiliation needs a chapter boundary",
    "A promise with two interpretations",
    "The archive has no recorded evidence",
    "The narrator may be unreliable",
    "The bell rings before the procession",
  ];
  issueTitles.forEach((title, index) =>
    state.issues.push({
      id: `issue-${index + 1}`,
      storyId: "story-blood-orchard",
      chapterId:
        index === 0
          ? "blood-orchard-ch-13"
          : index === 2
            ? "blood-orchard-ch-20"
            : index === 3
              ? "blood-orchard-ch-18"
              : "blood-orchard-ch-03",
      entityId:
        index === 0
          ? "entity-14"
          : index === 1
            ? "entity-7"
            : index === 2
              ? "entity-5"
              : index === 3
                ? "entity-3"
                : index === 5
                  ? "entity-9"
                  : `entity-${index + 1}`,
      factIds:
        index === 0
          ? ["fact-28"]
          : index === 1
            ? ["fact-13"]
            : index === 3
              ? ["fact-6"]
              : index === 5
                ? ["fact-17"]
                : [`fact-${index * 2 + 1}`],
      kind:
        index === 2 || index === 5
          ? "MISSING_CONTEXT"
          : index > 3
            ? "AMBIGUITY"
            : "CONTRADICTION",
      severity: index === 0 ? "CRITICAL" : index < 4 ? "WARNING" : "INFO",
      status: index === 7 ? "RESOLVED" : "OPEN",
      title,
      explanation:
        index === 0
          ? "This passage mentions a usable key after its recorded destruction in Chapter 12."
          : index === 1
            ? "The draft names the southern gate; the recorded location places the orchard north of the city. Check whether these refer to different approaches."
            : "Compare this passage with its recorded source. This sample issue may describe an intentional reveal or a missing piece of context.",
      suggestion:
        "Inspect the source and decide whether the passage or the recorded fact needs an update.",
      anchor:
        index === 0
          ? anchor(13, 1)
          : index === 1
            ? anchor(3, 4)
            : index === 2
              ? anchor(20, 1)
              : index === 3
                ? anchor(18, 1)
                : index === 7
                  ? anchor(3, 2)
                  : anchor(3, Math.min(index + 1, 9)),
      note: "",
      history: [],
    }),
  );
  return state;
}
