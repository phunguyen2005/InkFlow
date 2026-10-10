# InkFlow

**Where stories find their flow.**

InkFlow is an English-first platform for creating, discovering, publishing, and reading serialized fiction.

Designed for authors and readers worldwide, InkFlow brings creative writing, narrative continuity, and literary discovery into a connected ecosystem.

## The InkFlow Ecosystem

### InkFlow Studio — A Space to Create

A private writing workspace for authors developing long-form fiction.

InkFlow Studio brings together chapter drafting, manuscript organization, worldbuilding, character management, and AI-assisted writing in a focused creative environment.

At its core, the **Canon Engine** is designed to help authors maintain narrative consistency across evolving stories by organizing fictional knowledge, retrieving relevant context, identifying potential continuity conflicts, and keeping authors in control of canonical decisions.

### InkFlow Library — A World to Explore

A public destination for discovering and reading original serialized fiction.

InkFlow Library provides a story-first reading experience with genre exploration, story discovery, detailed story pages, author profiles, chapter navigation, and personalized reading preferences.

Its editorial visual language puts storytelling, artwork, and readability at the center of the experience.

### Publishing Pipeline — From Draft to Publication

InkFlow separates private creative work from publicly available reading content.

The publishing workflow is designed around content submission, automated policy screening, moderation review, and immutable published snapshots.

This separation establishes a clear boundary between an author's evolving manuscripts and the content available to readers.

## Product Principles

- **Authorial control:** Writers retain creative authority over their work and canonical decisions.
- **Narrative continuity:** Structured fictional knowledge supports consistency throughout long-running stories.
- **Reading without distraction:** Typography, layout, and personalization support immersive long-form reading.
- **Global storytelling:** English-first experiences with support for diverse fictional genres and creative voices.
- **Privacy by design:** Private writing environments and public published content have distinct access boundaries.
- **Thoughtful AI integration:** AI supports creative work without replacing the author's judgment.

## Technology & Architecture

InkFlow's technical architecture is centered on a modular monolith, with clearly separated product domains and responsibilities.

| Layer | Technology |
|---|---|
| Application | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Database & Authentication | PostgreSQL, Supabase |
| Data Security | Row Level Security and server-side authorization |
| Background Processing | Job queues and asynchronous workers |
| AI Integration | Multi-provider Model Gateway |

The system design emphasizes maintainability, data isolation, explicit authorization, observability, and controlled AI resource consumption.

## Design Philosophy

**Ink & Intelligence**

InkFlow combines literary expression with intelligent technology.

The Library follows a cinematic editorial direction characterized by expressive typography, atmospheric artwork, restrained colors, and immersive reading surfaces.

The Studio prioritizes clarity, focus, and efficient creative workflows.

Both experiences share a common product identity while serving different needs.

## Project Documentation

Product requirements, design specifications, engineering decisions, and implementation guidelines are organized separately to maintain clear responsibilities between product design and technical development.

## Developer Operations & Getting Started

### Prerequisites
- Node.js 20+ (recommended LTS)
- npm 10+
- **Windows PowerShell Note**: On Windows PowerShell or Command Prompt, execute commands using `npm.cmd` and `npx.cmd` to ensure correct shell execution.

### Installation
Clone the repository and install dependencies:
```powershell
npm.cmd install
```

### Local Development Server
Start the Next.js App Router development server:
```powershell
npm.cmd run dev
```
*Note: The `predev` script automatically executes `npm run content` to compile catalog fixtures from `content-library.md`.*  
The application is accessible at `http://127.0.0.1:3000`.

### Code Quality & Validation
Run linting, typechecking, and unit tests:
```powershell
# Run ESLint across Next.js codebase
npm.cmd run lint

# Generate Next.js types and verify TypeScript without emitting output
npm.cmd run typecheck

# Run Vitest unit test suite (8 tests covering catalog fidelity, filters, and storage)
npm.cmd test
```

### Production Build & Run
To test the production build locally:
```powershell
# Compile production bundle
npm.cmd run build

# Start local production server
npm.cmd run start
```
The production server will listen at `http://127.0.0.1:3000`.

### End-to-End (E2E) Testing
Playwright E2E tests run against the production build:
```powershell
# Ensure Chromium browser is installed
npx.cmd playwright install chromium

# Run all 6 Playwright E2E tests
npm.cmd run test:e2e
```
*Tip: If running against a server on a different port, set `$env:PLAYWRIGHT_BASE_URL="http://127.0.0.1:3001"`.*

### Lab Performance Benchmarking
Measure synthetic mobile performance (3 iterations with 4x CPU throttling & 150ms network latency):
```powershell
node scripts/measure-performance.mjs
```
Results are saved to `docs/qa/performance.json`.

### Public Library Routes
The Public Library foundation implements the following five routes:
- `/` — Public Library Homepage (Discovery shelves, hero artwork, genre quick-links)
- `/explore` — Search & Filter Catalog (Multi-genre, tropes, completion status, URL state)
- `/stories/[storySlug]` — Story Detail & Chapter Index
- `/stories/[storySlug]/chapters/[chapterSlug]` — Focused Reader Shell (Theme, font sizing, reading progress)
- `/authors/[authorSlug]` — Public Author Profile & Published Works

### Architectural Boundary Notice
This foundation represents the **Public Library** only. InkFlow Studio drafting workflows, Canon Engine tools, editorial moderation queues, and live AI generation are private author workspaces and are intentionally not included in public routes.

---

**InkFlow Studio** is a working product name, subject to trademark and legal verification.

© InkFlow. All rights reserved.
