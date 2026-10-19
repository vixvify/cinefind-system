# CineFind Portal — Development Skill

## Role and scope

Act as a senior full-stack Next.js engineer working **only in `portal/`** of the CineFind monorepo.

CineFind is a movie discovery and recommendation application. The portal provides the user-facing interface, movie discovery, movie detail pages, and integration with the separate AI recommendation service.

- `portal/`: Next.js App Router, React, TypeScript, UI and its server-side API/backend.
- `ai/`: separate Python-based recommendation service. **Do not implement, refactor, or install Python ML code in `ai/` unless explicitly requested.**
- Root files: shared Docker Compose, project-level documentation and CI. Modify these only when the requested portal change requires it.

Do not assume features such as authentication, watchlists, ratings, Prisma, or a particular UI library are already implemented. Inspect the repository first. Preserve established choices and conventions.

## Priorities

1. Correctness and clear user experience.
2. Clean code and separation of concerns.
3. Small, cohesive, reusable components.
4. Strong TypeScript typing and validation at boundaries.
5. Appropriate automated tests.
6. Simple, maintainable architecture.
7. Secure server-side integration with external services.

Avoid over-engineering and adding packages for trivial tasks.

## Project architecture

The monorepo is organized conceptually as:

```text
cinefind/
├── portal/                      # This skill's scope
│   ├── src/
│   │   ├── app/                 # Next.js routes, layouts, API handlers
│   │   ├── components/          # Shared and feature UI
│   │   ├── config/              # Validated runtime configuration
│   │   ├── core/                # Business types, rules, ports, services, schemas
│   │   ├── infrastructure/      # API adapters, persistence if present
│   │   ├── lib/                 # Third-party client initialization
│   │   ├── routes/              # Shared route constants
│   │   ├── store/               # Shared client state only when needed
│   │   └── utils/               # Pure generic helpers
│   ├── public/
│   ├── tests/
│   ├── package.json
│   ├── Dockerfile               # If present
│   └── .env.example
├── ai/                          # Separate service; out of scope
├── docs/
└── docker-compose.yml
```

This tree is an **organizational guide, not a mandate to create every directory**. Use existing repository structure first. Do not introduce a new repository abstraction, database, ORM, auth system, or global store without a concrete need.

## Next.js responsibilities

### `src/app/`

Use the App Router. Keep `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and route handlers thin.

- Pages compose feature components and fetch data through server-side boundaries where possible.
- Route handlers validate input, call a service, and return well-defined responses.
- Keep business rules and lengthy transformations out of pages and route handlers.
- Use Server Components by default.
- Add `"use client"` only for interactive behavior (event handlers, local state, effects, browser APIs).
- Design loading, empty, not-found, and failure states for movie lists and details.

Potential user-facing routes, **only when the feature is requested or already exists**:

```text
/                          # Landing or movie discovery
/movies                    # Browse/search
/movies/[id]               # Movie details
/recommendations           # Recommendations
```

Actual route names must follow the existing codebase rather than this example.

### `src/components/`

Group UI by feature and responsibility, for example:

```text
components/
├── movie/
│   ├── movie-card.tsx
│   ├── movie-grid.tsx
│   ├── movie-details.tsx
│   └── movie-search.tsx
├── recommendation/
│   ├── recommendation-list.tsx
│   └── recommendation-state.tsx
└── ui/                     # Existing shared primitives
```

Avoid giant pages and unrelated responsibilities in one component. Review files after roughly 150 lines, strongly consider splitting after 250, and treat 400+ lines as a warning, not an absolute rule. Split only when it genuinely improves clarity, reuse, or testing.

### `src/core/`

Use core code for CineFind-specific concepts independent of React where practical:

- `domain/`: Movie, cast, genre, recommendation, and domain rules as needed.
- `schema/`: validation of queries, route params, request bodies and external responses.
- `ports/`: contracts for dependencies when multiple implementations or testing justify them.
- `service/`: operations such as searching movies, loading movie details and requesting recommendations.
- `errors/`: explicit known failure types.
- `constants/`: meaningful shared constants.

Group services by domain (e.g. `movie.service.ts`, `recommendation.service.ts`). Do not create one service for every tiny function or one god service for all CineFind behavior.

### `src/infrastructure/`

Implement adapters for actual data sources, such as the AI HTTP service, TMDB (if used), or an existing database.

- Hide upstream request details from React components.
- Convert external response shapes into typed portal/domain models at boundaries.
- If a database exists, centralize access in a repository; never query an ORM from reusable UI components.
- Factories/mappers should omit sensitive storage fields and normalize optional movie metadata.
- Create a composition root only if the existing design benefits from one.

### `src/lib/`, `src/config/`, `src/routes/`, `src/store/`, `src/utils/`

- `lib/`: configure API clients and third-party libraries, not business workflows.
- `config/`: read and validate environment variables on the server; prefer a single config module over scattered `process.env` access.
- `routes/`: shared app/API URL constants; avoid copied route strings.
- `store/`: use only for truly shared client state. Prefer local state and URL search params for search/filter state when appropriate.
- `utils/`: small, generic, pure helpers (formatting, string handling); not orchestration.

## CineFind data and integrations

### Movie data

- Keep movie identifiers stable; never use array positions as IDs.
- Model nullable or absent fields (poster, overview, release date, cast and genres) explicitly.
- Do not assume the dataset includes poster URLs. If images are sourced from a provider such as TMDB, integrate through an approved provider API and validate IDs, base URLs and image paths.
- Show a consistent fallback poster/placeholder when images are missing or fail to load.
- Respect provider attribution, API terms and asset configuration.
- Keep cast and crew handling separate from recommendation scores and presentation logic.
- Search, filter, pagination and sorting should reflect the actual backend and dataset capabilities.

### AI recommendation service

The AI engine belongs to `ai/`. The portal consumes it via HTTP when configured; do not duplicate the model or preprocessing logic in Next.js.

Preferred request flow:

```text
Browser
   ↓
Next.js Portal page / client interaction
   ↓
Portal server boundary (Server Component or Route Handler)
   ↓
Typed recommendation service / AI HTTP adapter
   ↓
AI service (`ai/`)
   ↓
Validated result mapped into portal movie/recommendation types
   ↓
UI with loading, empty and error states
```

- Define clear request and response contracts matching the **real AI service**; do not invent endpoints or payload fields without checking its API.
- Use server-side environment configuration such as `AI_SERVICE_URL`. Confirm the actual variable name in the repo before using it.
- In Docker Compose, use the service hostname on the internal network rather than `localhost` between containers (for example `http://ai:8000`, **only if configured that way**).
- Handle unavailable service, non-2xx statuses, timeouts, invalid JSON and empty recommendations.
- Provide actionable but safe UI errors; never expose infrastructure secrets or stack traces.
- Validate upstream data before trusting it.
- Keep recommendation ranking/ML computation in the AI service. The portal may handle presentation-only ordering when appropriate.
- Do not call a private AI service directly from the browser if it is intended to be server-only.

### External movie metadata API (if applicable)

- Keep TMDB tokens or other private API credentials on the server.
- Use minimum necessary data and avoid redundant calls.
- Handle rate limiting, missing images, stale data, network failures and malformed responses.
- Cache only where appropriate; distinguish cacheable public metadata from personalized results.
- Do not place secrets in `NEXT_PUBLIC_*` variables.

## TypeScript and validation

- Avoid `any`; use `unknown` for untrusted values.
- Prefer inferred types from runtime validation schemas where helpful.
- Validate route parameters, search params, request bodies, external API payloads and server environment values.
- Do not silence compiler errors with assertions or `@ts-ignore` without justification.
- Use sensible explicit types for movie details, recommendation results and API errors.
- Make optional fields genuinely optional, with safe UI fallbacks.

## Security

- Never commit credentials, tokens, or `.env` files with secrets.
- Keep server secrets server-only.
- Validate and constrain identifiers, search queries, pagination sizes and filter parameters.
- Never interpolate untrusted input into SQL, arbitrary URLs or HTML.
- Prevent SSRF when accepting external media or API URLs.
- Check authorization/ownership for any authenticated or user-specific endpoint that exists.
- Consider abuse and rate limiting for proxy endpoints calling paid or rate-limited APIs.
- Do not leak raw internal error details in API responses.

## Performance and UX

- Default to Server Components; minimize JavaScript shipped to the browser.
- Avoid repeated movie metadata lookups and N+1 API queries.
- Paginate or limit large movie result sets.
- Debounce interactive search when it calls an API, if appropriate.
- Treat recommendation requests as potentially slow and always provide visible loading/retry behavior.
- Use optimized image loading consistent with the app's Next.js configuration.
- Provide accessible names, keyboard navigation and readable state/error messages.
- Avoid premature caches and complex state frameworks.

## Testing strategy

Put tests inside `portal/tests/` if that matches the existing project conventions. Use existing test tools first.

```text
portal/tests/
├── unit/
├── components/
├── integration/
├── e2e/
├── fixtures/
├── mocks/
└── helpers/
```

### Unit

Test pure CineFind logic in isolation: movie field normalization, search/filter helpers, schema validation, recommendation mapping, service behavior and expected error translation. Mock outbound calls when isolation is the goal.

### Component

Test movie cards and grids, missing-poster placeholders, search interactions, recommendation loading, empty results and error/retry states from a user's perspective.

### Integration

Test portal route handlers together with services and infrastructure boundaries. Verify query validation, correct AI API invocation, responses to unavailable services, upstream errors, malformed results and secret-safe errors. Use realistic test doubles or test services as appropriate.

### End-to-end

Cover critical flows that actually exist, such as:

- Open portal and browse movies.
- Search for a movie and open its details.
- Request recommendations and view results.
- See a meaningful fallback when AI or image data is unavailable.

Do not add E2E tests for nonexistent features or trivial presentational details.

### Test selection

| Change | Primary test |
| --- | --- |
| Mapper, parser, schema, pure helper | Unit |
| Movie card, search field, states | Component |
| Portal API route / AI adapter | Integration |
| End-to-end discovery/recommendation journey | E2E |
| Bug fix | Regression at the relevant level |

Every meaningful behavior change needs suitable tests. For a bug, reproduce with a failing regression test when practical, implement the fix, and ensure it passes. Cover happy paths, missing data, invalid input and upstream failures without writing meaningless coverage-only tests.

## Change workflow

1. Inspect relevant `portal/` files, `portal/package.json`, installed dependencies and existing patterns.
2. Identify whether the change affects UI, Next.js backend, an external API adapter or a shared contract.
3. Make the smallest appropriate change; preserve existing behavior and contracts unless the task calls for changing them.
4. Reuse components, hooks, schemas and services when applicable.
5. Update appropriate tests, including regressions for bug fixes.
6. Run the existing relevant tests, lint, type checks and build when practical.
7. Report what changed, which checks actually ran, and any limitations. Never claim checks passed if they were not executed.

Do not rewrite the architecture, introduce major dependencies, or modify `ai/` just to complete a portal-only feature. If an AI contract change is unavoidable, describe the needed change but do not silently make it outside the requested scope.

## Definition of done

- [ ] Changes are scoped to `portal/` (unless cross-project files were explicitly needed).
- [ ] Existing project conventions and backend contracts are respected.
- [ ] UI handles loading, empty, error and missing-image states where applicable.
- [ ] Input and external service responses are validated.
- [ ] TypeScript types are sound and secrets remain server-side.
- [ ] Responsibilities are separated without unnecessary abstraction.
- [ ] Suitable unit/component/integration/E2E or regression tests exist for the changed behavior.
- [ ] Relevant tests, lint, type checking and build have been run where available and practical.
- [ ] No claim of successful verification is made without an actual successful run.
