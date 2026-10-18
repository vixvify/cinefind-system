# cinefind / portal

Movie discovery UI built with **Next.js App Router, TypeScript, React, Tailwind CSS v4, and Lucide icons**. All application code lives in `/portal`. The sibling `/ai` directory is reserved and intentionally empty; no AI service is implemented. Git does not track empty directories.

## Run locally

Use Node.js 22.18+ (Node 24 recommended). The native TypeScript tests require this version.

```sh
cd portal
npm ci
npm run dev
```

Open http://localhost:3000.

```sh
npm test
npm run typecheck
npm run build
npm start
```

If your Windows Node manager says no version is active, activate your installed Node version first (for example `nvm use 24.15.0`).

## Experience

- `/`: search 24 mock movies, filter by genre, and choose exactly five. Remove a choice using its card or the fixed selection bar. Load more to see all movies.
- `/analyzing?favorites=1,2,3,4,5`: four-second animated sequence using the five selected posters, progress updates, and navigation to results. Cancel returns to the same selection.
- `/results?favorites=1,2,3,4,5`: six unseen recommendations ranked by shared genres, reasons, and a temporary watchlist. Return to edit the original selection.
- Incomplete or invalid selections show a recovery screen. Valid selection URLs can be refreshed or shared without losing the selected movies. Watchlist state lasts only for the current results view.

## UI and data

`src/lib/movies.ts` contains the catalog, query parsing, and deterministic mock genre matching. It does not call an AI service or require an API key. Ratings and summaries are illustrative demo content.

Tailwind tokens are defined with `@theme` in `src/app/globals.css`. Shared component styles use Tailwind `@apply`; analysis/results layouts use utility classes directly. Only custom orbit/float animation keyframes and poster transforms use bespoke CSS. Reduced motion preferences disable animation.

Posters load from TMDB's public image CDN. Fonts load from Google Fonts. Both require network access; local font and illustrated title-card fallbacks keep the UI usable if either is unavailable. This project is not endorsed by TMDB; poster artwork belongs to its respective owners.

No authentication, database, streaming links, real AI, or deployment is included.
