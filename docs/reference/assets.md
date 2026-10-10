# Artwork

All 20 cover images and the Blood Orchard hero are original bitmap illustrations generated with the built-in image_gen tool for this implementation. No third-party cover from content-library.md is hotlinked or redistributed. Original imageRefIds and sourcePage references remain in the imported source data for traceability.

Final assets: `public/mock/covers/*.webp` (768 x 1024) and `public/mock/heroes/*.webp` (wide landscape heroes for featured slider). Mapping and dimensions are recorded in `asset-manifest.json`. Author avatars are initials, not portraits of real people. Sharp is used only for image encoding, delivery-size normalization and QA contact sheets.

Prompt template: "Use case: illustration-story. Asset: original premium literary fiction book cover, portrait 3:4. Scene: [story-specific scene]. Style: expressive painterly illustration with graphic-novel ink textures, excellent hand-painted composition, rich complex detail, confident silhouettes and a strong sense of scale. Beautiful readable subject with atmospheric depth. Not a photograph, not an existing franchise. Full-bleed artwork only, NO text, no title, no letters, no frame, no logo, no watermark. This is a standalone image to be used under HTML titles on a literary library website."

Scenes used:

| Story | Scene and palette |
|---|---|
| The Blood Orchard | Exiled heir, ruined manor, silver trees, crimson leaves and an ivory moon |
| The Quiet Machine at Dawn | Female salvage pilot, gigantic abandoned machine above desert moons, brass and oxidized teal |
| A Map for Moonlight | Cartographer and sleepless prince, luminous map, balcony and moonlit city |
| The House Beneath the Stairs | Impossible staircase under a kitchen, red door, eerie teal shadows |
| Snowfall at Room Seven | Snowbound hotel, solitary detective, red umbrella, warm windows |
| The Alchemist's Second Life | Young alchemist, potion shop, emerald glass and copper tools |
| The Saltwind Atlas | Three navigators, magical map, orange sail and turquoise sea |
| The Velvet Treaty | Diplomat in emerald, sealed treaty, rival prince across a marble court |
| The Lanterns of Briar Row | Magical flower shop, cobbled street, sage leaves and pink blossoms |
| Black Signal | Female negotiator, rain-soaked city, red broadcasts reflected in glass |
| The Last Level Before Dawn | Adventurer party and support mage on a monumental dungeon stair at dawn |
| The Fox in the Rain Court | Court musician, rain courtyard, fox spirit reflected in water, white and vermilion |
| The Unreliable Moon | Floating white city beneath a fractured moon, coral and turquoise |
| A Knife for Every Name | Assassin with silver dagger, eclipsed red sun, black and vermilion |
| The Detective of Small Miracles | Detective and ghost partner rearranging clues, green and marigold |
| The Crownless Tournament | Small challenger before an empty throne, heraldic arena, jade and red |
| The City That Forgot Its Name | Muralist among blank street signs, city dissolving into sky |
| The River Keeps Score | Scout on fortress, silver river, harsh wilderness, pale returned figure |
| A Season of Borrowed Stars | Magician and astrologer on rooftop, falling constellation, coral and indigo |
| The Iron Orchard | Archivist with treaty among metallic trees, silver fruit and old palace |

Hero prompt: wide 2:1 / 16:9 cinematic landscape with the main subject on the right, naturally dark values on the left for HTML copy, rich atmospheric lighting, and high textural depth. No typography, logo, watermark or screenshot UI inside the asset. Generated heroes include *The Blood Orchard*, *The Quiet Machine at Dawn*, *A Map for Moonlight*, *The Lanterns of Briar Row*, and *The Saltwind Atlas*.

Selected final generation records for the assets are also retained as JSON. The delivered WebP files are self-contained; the application never depends on the original generation directory.
