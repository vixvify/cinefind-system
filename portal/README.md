# cinefind / portal

Next.js App Router + TypeScript + Tailwind CSS. The portal reads the movie catalog from `../ai/data/raw/tmdb_5000_movies.csv` on the server. It never writes to `/ai` or calls the AI service. Recommendations remain a local genre-matching demo.

## Run

Use Node.js 22.18+ (24 recommended), and run from the `portal` directory:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. The dataset must be present at runtime; it is not copied into the source tree or bundled with the app. An absolute or portal-relative `MOVIE_DATASET_PATH` in `.env.local` can override the default. Run `npm start` from `portal` after `npm run build` for production.

## Poster setup

The dataset includes TMDB movie IDs but **does not include poster paths**. Movie selection works without a key using title-card placeholders. To show real posters:

1. Copy `.env.example` to `.env.local` inside `portal`.
2. Obtain an **API Read Access Token** from [TMDB API settings](https://www.themoviedb.org/settings/api).
3. Set `TMDB_READ_ACCESS_TOKEN` to that token. Alternatively, set `TMDB_API_KEY` to a v3 API key. If both are set, the token takes precedence.
4. Restart the Next.js server and refresh the page.

Do not prefix either variable with `NEXT_PUBLIC_`. `.env.local` is ignored by Git. Credentials are only used by the server. The browser requests `/api/posters/<tmdb-id>`; the route validates that the ID belongs to the dataset, gets its `poster_path`, and redirects to TMDB's image CDN. Successful lookups and redirects are cached for 24 hours. Missing images, invalid credentials, timeouts, and upstream errors fall back to the title card without breaking selection. No bulk download of all posters is performed.

References: [TMDB authentication](https://developer.themoviedb.org/docs/authentication-application), [movie details](https://developer.themoviedb.org/reference/movie-details), [image URLs](https://developer.themoviedb.org/docs/image-basics).

## Docker Compose

The unified `compose.yaml` in the repository root mounts `./ai/data` at `/dataset` and configures `MOVIE_DATASET_PATH` automatically. Run from the repository root:

```sh
docker compose up --build portal
```

The portal bind mount makes `portal/.env.local` available to Next.js. Recreate or restart the portal container after changing credentials. For other deployments, mount the CSV at a readable path and set `MOVIE_DATASET_PATH` accordingly.

## Behavior and checks

- Browse the real dataset, ordered by its stored popularity. Search titles, release years, and Thai genres. Load more in batches of 12; choose exactly five films.
- URL selection IDs are now real TMDB IDs. Old demo links using IDs 1–24 may be invalid or refer to different movies. For example: `/results?favorites=157336,27205,19995,155,550`.
- The four-second animation leads to six unseen recommendations. Ratings and years come from the historical dataset, not current TMDB scores. Recommendation order is still a deterministic UI demo, not the `/ai` recommender.
- No full CSV, credits, or unused synopsis fields are sent to the browser. A compact catalog is shared through the root provider for search and matching. The server caches parsed data and reloads it when file size or modification time changes; refresh the browser to receive updates.
- The temporary watchlist resets when leaving results. Fonts require Google Fonts connectivity and fall back to installed fonts.

```sh
npm test
npm run typecheck
npm run build
```

Tests cover CSV quoting and malformed rows, selection validation, recommendations, and mocked TMDB credential/error handling. Live poster access additionally requires a valid personal TMDB credential and internet connectivity.
