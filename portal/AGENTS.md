# AGENTS.md

## Project Overview

CineFind is a movie discovery and recommendation project with two distinct applications:

- `portal/`: a fullstack web application built with Next.js, React, and TypeScript. It owns the user-facing UI and its Next.js backend/API routes.
- `ai/`: a separate Python AI service responsible for recommendation/model logic.

**This AGENTS.md applies only to `portal/`.** Do not edit `ai/`, its Python dependencies, notebooks, models, or training pipeline unless explicitly requested. The repository root may contain shared Docker Compose configuration; do not alter it without a task-specific need.

The Portal communicates with the AI service through an explicit HTTP API contract. A Portal change must not assume the ability to import Python code directly or silently change the AI service API.

The following is the **Portal-local** reference structure. Preserve the real existing layout; these are conventions, not instructions to create missing folders or adopt unused packages:

```text
.
├── src/
│   ├── app/
│   │   ├── (auth)/                  # only if authentication exists
│   │   ├── api/
│   │   └── proxy.ts
│   ├── components/
│   ├── core/
│   │   ├── constants/
│   │   ├── domain/
│   │   ├── errors/
│   │   ├── ports/
│   │   ├── schema/
│   │   └── service/
│   ├── infrastructure/
│   │   ├── factories/
│   │   ├── interface/
│   │   ├── repositories/
│   │   └── container.ts
│   ├── lib/
│   │   ├── config.ts
│   │   └── utils.ts
│   ├── routes/
│   └── store/
│
├── prisma/                  # only if Prisma is already in use
│   ├── schema.prisma
│   └── types/
├── tests/
│   ├── unit/
│   ├── components/
│   ├── integration/
│   ├── e2e/
│   ├── fixtures/
│   ├── mocks/
│   └── helpers/
│
├── public/
├── .env.example
├── docker-compose.yml       # only if this file lives in portal/
├── Dockerfile
├── package.json
└── tsconfig.json
```

Always preserve this architecture unless explicitly instructed otherwise.

Do not introduce a completely different architecture or reorganize the project without a strong technical reason.

---

# CineFind Portal Responsibilities

The Portal is responsible for movie discovery experiences, including movie search, browse/results, detail pages, movie images and cast/crew presentation, and recommendation results as the supported product requirements evolve. Do not assume every example feature already exists.

- **Movie metadata and posters:** Use the existing TMDB integration/configuration where implemented. Dataset records may only contain titles, cast, or crew; do not assume poster URLs are present. Where necessary, resolve metadata server-side using a verified identifier or carefully matched metadata. Handle missing or ambiguous matches gracefully.
- **External movie API:** Keep TMDB credentials and read-access tokens server-side; do not expose them to Client Components. Validate external responses, use sensible timeouts, and handle rate limits and missing media.
- **Recommendations:** The Python AI service owns model training, feature engineering, inference, and ranking algorithms. The Portal owns input validation, HTTP request orchestration, mapping responses into UI models, and user-visible loading/empty/error states. Do not duplicate ML code in Next.js.
- **Service boundaries:** Centralize external HTTP integrations behind appropriately named clients/adapters in the existing infrastructure or lib layer. Read service base URLs and credentials from the Portal's validated configuration. Never hardcode localhost URLs into browser-facing code.
- **Data:** Use existing identifiers and dataset conventions. Do not invent a database, Prisma schema, accounts, authentication, reviews, watchlists, or persistence solely because examples in this guide mention them.
- **Privacy and safety:** Treat search input, external API data, and AI responses as untrusted. Avoid logging secrets, raw credentials, or unnecessarily sensitive user data.

Example request flow (adapt to the existing implementation):

```text
Portal Page / Client Component
              ↓
      Next.js Route Handler or Server Action
              ↓
      Movie / Recommendation Service
              ↓
      TMDB / AI HTTP Adapter
              ↓
      External API / Python AI Service
```

Keep network calls on the server when credentials, access rules, or cross-origin boundaries require it. If an AI endpoint is unavailable, return a controlled error/empty state instead of fabricated recommendation results.

---

# Core Principles

Always prioritize:

- Clean Code
- Separation of Concerns
- Small and focused components
- Reusable components
- Strong TypeScript typing
- Clear naming
- Testability
- Maintainability
- Minimal duplication
- Consistent project structure
- Appropriate automated testing

Do not write code only to make a feature work.

Write code that another developer can easily understand, test, maintain, and extend.

Avoid over-engineering.

Use the simplest architecture that keeps responsibilities clear.

---

# Before Writing Code

Before implementing or modifying anything:

1. Inspect existing related files.
2. Understand the current implementation.
3. Understand the current project structure.
4. Search for existing reusable components.
5. Search for existing services.
6. Search for existing schemas.
7. Search for existing repositories.
8. Search for existing utilities.
9. Search for existing tests related to the feature.
10. Determine which layer owns the new responsibility.
11. Determine whether existing components should be split.
12. Determine which test types are required.

Do not immediately create new abstractions or files before inspecting the existing codebase.

---

# Source Structure

## `src/lib/config.ts`

Contains shared application configuration and server runtime environment parsing. Application code must consume the exported config instead of reading `process.env` directly. Keep secrets and provider credentials inside the server runtime portion of this boundary.

---

## `src/app`

`src/app` is responsible for Next.js routing and page composition.

It may contain:

- pages
- layouts
- route groups
- loading states
- error boundaries
- not-found pages
- route handlers
- server actions

Keep files inside `app` thin whenever possible.

Pages should primarily:

- fetch or prepare page-level data
- compose components
- handle route-specific concerns

Avoid putting large UI implementations directly inside:

```text
page.tsx
layout.tsx
route.ts
```

Avoid putting reusable business logic directly inside route files.

Extract meaningful UI into `src/components`.

Move reusable business logic into `src/core`.

---

# Components

## `src/components`

Contains UI components.

Components should have one clear responsibility.

Prefer:

```text
components/
└── movie/
    ├── movie-header.tsx
    ├── movie-filter.tsx
    ├── movie-list.tsx
    ├── movie-card.tsx
    ├── movie-pagination.tsx
    └── movie-search-form.tsx
```

instead of:

```text
components/
└── movie-page.tsx
```

containing the entire feature.

---

## Component Extraction

Extract a component when:

- a UI section has its own responsibility
- a section is reusable
- a section has independent interaction logic
- a component contains several unrelated sections
- the parent component becomes difficult to understand
- extracting it makes the parent easier to read
- a section can reasonably be tested independently

Do not extract meaningless components solely to reduce line count.

Split by responsibility.

---

## Component Size

There is no strict line limit.

Use these values as warning signs:

```text
150+ lines → review whether extraction improves clarity
250+ lines → strongly consider splitting
400+ lines → usually unacceptable
```

When modifying an already large component, consider extracting responsibilities before adding more code.

Do not continuously add functionality to an oversized component.

---

# Server and Client Components

Prefer Server Components by default.

Use `"use client"` only when necessary for:

- React state
- React effects
- event handlers
- browser APIs
- client stores
- client-only libraries

Do not convert an entire page or layout into a Client Component because one small section requires client-side behavior.

Prefer:

```text
page.tsx
├── movie-header.tsx
├── movie-list.tsx
└── movie-filter.client.tsx
```

Keep client boundaries as small as practical.

---

# Core

## `src/core`

Contains application and business logic.

Core code should remain separate from UI implementation details.

---

## `src/core/domain`

Contains domain models and business rules.

Examples:

```text
domain/
├── user.ts
├── movie.ts
├── recommendation.ts
└── movie-credit.ts
```

Domain files may contain:

- domain types
- domain models
- domain-specific rules
- domain-specific calculations

Domain code should not depend on:

- React
- UI components
- Zustand
- browser APIs
- UI libraries

---

# Ports

## `src/core/ports`

Contains contracts required by the application.

Examples:

```text
ports/
├── user.repository.ts
├── movie.repository.ts
└── storage.port.ts
```

Example:

```ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
}
```

Ports define what the application needs.

They should not contain database-specific implementation details.

---

# Services

## `src/core/service`

Contains application services grouped by domain or feature.

Prefer one main service per domain/module.

Example:

```text
service/
├── auth.service.ts
├── user.service.ts
├── movie.service.ts
└── recommendation.service.ts
```

A service may contain multiple related operations.

Example:

```ts
export class AuthService {
  async signIn() {}

  async signUp() {}

  async signOut() {}

  async refreshToken() {}

  async getCurrentUser() {}
}
```

Prefer:

```text
auth.service.ts
user.service.ts
movie.service.ts
```

instead of unnecessarily splitting every operation into:

```text
create-user.service.ts
update-user.service.ts
delete-user.service.ts
get-user.service.ts
```

Do not over-engineer service structure.

Keep each service focused on one domain or feature.

If a service becomes genuinely too large or contains a clearly independent responsibility, extract only that responsibility.

For example:

```text
auth.service.ts
token.service.ts
password.service.ts
```

only when token or password logic becomes complex enough to justify separation.

---

# Schemas

## `src/core/schema`

Contains validation schemas.

Use schemas for:

- form input
- request bodies
- route parameters
- query parameters
- search parameters
- environment input
- external API responses when required

Prefer deriving TypeScript types from schemas when practical.

Example:

```ts
export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

Avoid manually duplicating types that can safely be inferred.

---

# Constants

## `src/core/constants`

Contains shared application constants.

Examples:

```text
constants/
├── role.constant.ts
├── route.constant.ts
└── pagination.constant.ts
```

Avoid magic strings and magic numbers when a shared constant improves clarity.

Do not create constants for trivial one-time values without a reason.

---

# Infrastructure

## `src/infrastructure`

Contains technical implementation details.

Examples:

- database implementations
- external API implementations
- file storage implementations
- authentication integrations
- persistence

---

## `src/infrastructure/repositories`

Contains repository implementations.

Example:

```text
core/
└── ports/
    └── user.repository.ts

infrastructure/
└── repositories/
    └── user.repository.ts
```

Prefer this dependency flow:

```text
Page / Route / Server Action
        ↓
      Service
        ↓
       Port
        ↓
Repository Implementation
        ↓
     Database
```

Avoid database access scattered across random files.

Do not access the ORM directly from reusable React components.

---

## `src/infrastructure/interface`

Contains infrastructure-specific interfaces or types.

Examples:

- database result types
- external API response types
- storage provider types

Do not place core business models here.

---

## `src/infrastructure/factories`

Contains mappings from infrastructure data to domain output models.

When the Portal already uses Prisma, repositories may return Prisma records internally. Services call factories to choose and shape the data returned to callers; factories must not expose sensitive persistence fields such as passwords.

---

## `src/infrastructure/container.ts`

The composition root for repository implementations and services. Route handlers and server-only helpers use its exported services instead of instantiating dependencies themselves.

---

## `prisma/types`

Only applies if the Portal already uses Prisma. Contains Prisma-specific model and payload types, including relations returned by repository queries. Keep these types separate from `src/core/domain`, which represents application output models.

---

## `src/routes`

Contains shared route constants for app and API paths. Keep route strings out of reusable components and services when a shared route constant already exists.

---

# Lib

## `src/lib`

Contains library initialization and technical configuration.

Examples:

```text
lib/
├── auth.ts
├── config.ts
├── http.ts
├── prisma.ts
└── utils.ts
```

Do not put application business logic inside `lib`.

---

# Store

## `src/store`

Contains global client-side state.

Use global state only when state genuinely needs to be shared across multiple distant components.

Prefer local component state when possible.

Do not put every piece of state into a global store.

Prefer focused stores:

```text
store/
├── ui.store.ts
├── movie-filters.store.ts
└── search.store.ts
```

Avoid one giant global store responsible for unrelated concerns.

---

# Utils

## `src/lib/utils.ts`

Contains generic reusable utility functions.

Utilities should preferably be:

- pure
- small
- reusable
- framework-independent
- easy to test

Examples:

```text
lib/
└── utils.ts
```

Do not put application workflows inside `utils`.

---

# Clean Code

Prefer:

- simple implementations
- explicit behavior
- meaningful names
- small functions
- early returns
- single responsibility
- minimal duplication
- clear control flow

Avoid:

- god components
- god services
- giant files
- deeply nested logic
- unnecessary abstractions
- premature optimization
- duplicated business logic
- giant utility files
- hidden side effects
- magic values

Choose readability over cleverness.

---

# Functions

Functions should have one clear responsibility.

Avoid deeply nested conditionals.

Prefer:

```ts
if (!user) return;
if (!user.active) return;
if (user.role !== "ADMIN") return;

performAction();
```

instead of:

```ts
if (user) {
  if (user.active) {
    if (user.role === "ADMIN") {
      performAction();
    }
  }
}
```

Extract complicated logic into clearly named functions when it improves readability.

---

# Naming

Use descriptive names.

Prefer:

```text
createUser
findUserByEmail
getMovieById
isAuthenticated
hasPermission
calculateTotalPrice
```

Avoid:

```text
data
thing
temp
doStuff
processData
handleThing
func1
```

Prefer kebab-case filenames.

Examples:

```text
user-card.tsx
auth.service.ts
user.repository.ts
format-date.ts
```

---

# TypeScript

Maintain strong type safety.

Avoid:

```ts
any;
```

Use:

```ts
unknown;
```

for untrusted values when appropriate.

Do not write:

```ts
value as any;
```

only to silence TypeScript.

Fix the actual type problem.

Avoid unnecessary type assertions.

Prefer schema-derived types when practical.

---

# Validation

Validate all external input.

This includes:

- forms
- request bodies
- query parameters
- route parameters
- environment variables
- uploaded files
- external API responses when necessary

Never trust client input.

---

# Error Handling

Handle expected errors explicitly.

Do not silently swallow errors.

Use meaningful application errors when useful.

Examples:

```text
UserNotFoundError
UnauthorizedError
InvalidCredentialsError
MovieNotFoundError
```

Do not expose:

- database errors
- stack traces
- secrets
- internal implementation details

to users.

---

# Database Rules

If the Portal uses a database, keep database access centralized.

Do not spread ORM queries across:

- components
- utilities
- random actions
- unrelated route handlers

Prefer repositories.

Use transactions when multiple database operations must succeed or fail together.

Consider:

- foreign keys
- unique constraints
- indexes
- database constraints
- pagination
- transactions

---

# Route Handlers

Keep `route.ts` files thin.

A route handler should generally:

1. receive input
2. parse input
3. validate input
4. call a service
5. return a response

Avoid implementing complex business rules directly inside route handlers.

---

# Server Actions

Keep Server Actions focused.

They should coordinate UI requests with application services.

Avoid large Server Action files containing substantial reusable business logic.

Move reusable logic into `core/service`.

---

# Reuse Existing Code

Before creating a new:

- component
- service
- repository
- schema
- type
- utility
- helper
- hook

search for an existing implementation first.

Reuse or extend existing code when appropriate.

Avoid duplicated functionality.

---

# Testing Architecture

All tests belong under the root `tests/` directory.

Use:

```text
tests/
├── unit/
├── component/
├── integration/
├── e2e/
├── fixtures/
├── mocks/
└── helpers/
```

Do not place test files inside `src` unless the project explicitly changes its testing convention.

---

# Test Types

## 1. Unit Tests

Location:

```text
tests/unit/
```

Unit tests verify small isolated pieces of logic.

Use unit tests for:

- services
- schemas
- utilities
- domain logic
- calculations
- transformations
- pure functions
- stores when appropriate

Example:

```text
tests/
└── unit/
    ├── core/
    │   ├── service/
    │   │   ├── auth.service.test.ts
    │   │   ├── user.service.test.ts
    │   │   └── movie.service.test.ts
    │   │
    │   ├── schema/
    │   │   ├── auth.schema.test.ts
    │   │   └── movie.schema.test.ts
    │   │
    │   └── domain/
    │       └── movie.test.ts
    │
    ├── lib/
    │   ├── format-date.test.ts
    │   └── calculate-age.test.ts
    │
    └── store/
        └── auth.store.test.ts
```

Unit tests should normally avoid real:

- databases
- HTTP servers
- external APIs
- file systems

Mock dependencies when isolation is the purpose of the test.

---

## 2. Component Tests

Location:

```text
tests/components/
```

Component tests verify React UI behavior.

Use component tests for:

- forms
- buttons
- modals
- cards
- filters
- pagination
- navigation
- interactive UI
- conditional rendering
- loading/error/empty states

Example:

```text
tests/
└── component/
    ├── auth/
    │   └── login-form.test.tsx
    │
    ├── movie/
    │   ├── movie-card.test.tsx
    │   ├── movie-filter.test.tsx
    │   └── movie-search-form.test.tsx
    │
    └── common/
        └── pagination.test.tsx
```

Test behavior from the user's perspective.

Prefer testing:

- visible text
- roles
- labels
- user interactions
- submitted values
- visible error states

Avoid testing internal React implementation details.

---

## 3. Integration Tests

Location:

```text
tests/integration/
```

Integration tests verify that multiple parts work correctly together.

Use integration tests for:

- repository + database
- service + repository
- route handler + service
- API behavior
- authentication flows
- database queries
- server actions
- persistence behavior
- multiple internal modules working together

Example:

```text
tests/
└── integration/
    ├── repositories/
    │   ├── user.repository.test.ts
    │   └── movie.repository.test.ts
    │
    ├── api/
    │   ├── auth.route.test.ts
    │   └── movie.route.test.ts
    │
    └── services/
        └── recommendation.integration.test.ts
```

When a database is part of the Portal, use a real test database when repository behavior itself is being tested, where practical.

Do not mock away the behavior that the integration test is supposed to verify.

---

## 4. End-to-End Tests

Location:

```text
tests/e2e/
```

E2E tests verify complete user workflows through the application.

Use E2E tests for critical flows.

Examples:

```text
tests/
└── e2e/
    ├── authentication.spec.ts
    ├── movie-recommendation.spec.ts
    ├── user-profile.spec.ts
    └── movie-details.spec.ts
```

Example scenarios:

```text
User can search for movies
User can view movie details and request recommendations
User sees graceful errors when TMDB is unavailable
User sees an empty state when no matches are found
User can browse recommendation results
```

Do not create E2E tests for every trivial visual detail.

Prioritize important user journeys. For CineFind, these include: searching by title, opening movie details, displaying missing posters, requesting similar-movie recommendations, and showing reliable states when TMDB or the AI service fails.

---

# Fixtures

Location:

```text
tests/fixtures/
```

Use fixtures for reusable predictable test data.

Example:

```text
fixtures/
├── users.ts
├── movies.ts
└── recommendations.ts
```

Prefer explicit deterministic test data.

Avoid random data unless randomness is specifically being tested.

---

# Mocks

Location:

```text
tests/mocks/
```

Use mocks for reusable mocked dependencies.

Example:

```text
mocks/
├── user.repository.mock.ts
├── auth.mock.ts
└── api.mock.ts
```

Do not mock everything by default.

Mock only when isolation is desirable.

---

# Test Helpers

Location:

```text
tests/helpers/
```

Use helpers for reusable testing utilities.

Examples:

```text
helpers/
├── render-with-providers.tsx
├── create-test-user.ts
├── test-db.ts
└── auth-helper.ts
```

Do not turn test helpers into another application framework.

Keep them small and obvious.

---

# What Test Should Be Written?

Use the following rules.

| Changed Code            | Required Test Type                       |
| ----------------------- | ---------------------------------------- |
| Utility function        | Unit                                     |
| Domain logic            | Unit                                     |
| Validation schema       | Unit                                     |
| Service                 | Unit                                     |
| Zustand/store logic     | Unit                                     |
| React component         | Component                                |
| Form behavior           | Component                                |
| Repository              | Integration                              |
| Database query behavior | Integration                              |
| API route               | Integration                              |
| Server action           | Unit or Integration                      |
| Authentication flow     | Integration + E2E for critical flows     |
| Critical user workflow  | E2E                                      |
| Bug fix                 | Regression test at the appropriate level |

A feature may require more than one test type.

For example:

```text
New movie recommendation feature

Unit
→ recommendation.service.test.ts

Component
→ recommendation-form.test.tsx

Integration
→ recommendation.route.test.ts

E2E
→ movie-recommendation.spec.ts
```

Do not automatically write every test type for every tiny change.

Choose tests based on the behavior and risk.

---

# Tests Are Mandatory

Every meaningful behavior change must include appropriate automated tests.

Testing is part of implementation.

Do not treat tests as optional follow-up work.

Whenever code behavior changes:

1. Identify affected tests.
2. Update existing tests.
3. Add missing tests.
4. Run relevant tests.

---

# Bug Fix Rule

Every bug fix should include a regression test whenever practical.

Required workflow:

```text
Write regression test
        ↓
Confirm failure
        ↓
Implement fix
        ↓
Confirm test passes
```

Never weaken or delete a valid existing test only to make new code pass.

---

# Test Quality

Tests should verify actual behavior.

Avoid meaningless tests.

Bad:

```ts
it("works", () => {
  expect(true).toBe(true);
});
```

Good:

```ts
it("returns an empty state when recommendations contain no movies", async () => {
  // ...
});
```

Cover when relevant:

- happy path
- edge cases
- invalid input
- failure cases
- business rules
- permissions
- user-visible error states

---

# Test Naming

Test names should describe expected behavior.

Prefer:

```ts
it("returns an error when the email is already registered");
```

instead of:

```ts
it("test register");
```

Prefer describing behavior rather than implementation.

---

# Refactoring

When refactoring:

- preserve existing behavior
- keep tests passing
- add missing tests when necessary
- improve separation of concerns
- reduce duplication
- split oversized components when useful

Do not perform unrelated large refactors during a focused task.

---

# Dependencies

Do not install new dependencies unless necessary.

Before adding one:

1. Inspect existing dependencies.
2. Check whether an equivalent package already exists.
3. Determine whether the functionality is simple enough without a new dependency.
4. Prefer stable and maintained packages.

Do not add libraries for trivial functionality.

---

# Security

Always consider:

- authentication
- authorization
- resource ownership
- IDOR
- input validation
- XSS
- CSRF
- SQL injection
- rate limiting
- uploaded files
- secrets

Never hardcode credentials or real secrets.

---

# Performance

Avoid obvious problems such as:

- unnecessary Client Components
- unnecessary React re-renders
- duplicated network requests
- N+1 queries
- unbounded queries
- missing pagination
- unnecessarily large client bundles

Do not sacrifice clean architecture for premature optimization.

---

# Scope Control

Keep changes focused on the requested task.

Do not:

- rename unrelated files
- reorganize unrelated modules
- rewrite working features without a reason
- introduce unrelated architecture changes

Preserve existing behavior unless a change is explicitly required.

---

# Verification

Before finishing any coding task, inspect `package.json`.

Run the relevant scripts that actually exist.

Typical commands may include:

```bash
npm test
npm run test:unit
npm run test:component
npm run test:integration
npm run test:e2e
npm run lint
npm run typecheck
npm run build
```

Do not assume these exact scripts exist. Run commands from `portal/` (or with the correct workspace/package selector), not from `ai/`.

Use the actual scripts available in the project.

Never claim a command passed unless it was actually executed successfully.

---

# Definition of Done

A meaningful coding task is complete only when:

- [ ] Requested behavior works
- [ ] Existing architecture is preserved
- [ ] Responsibilities are properly separated
- [ ] Components are appropriately split
- [ ] Existing reusable code was checked
- [ ] Unnecessary duplication was avoided
- [ ] TypeScript types are correct
- [ ] Input validation exists where required
- [ ] Error handling exists where required
- [ ] Appropriate test types were identified
- [ ] Tests were created or updated
- [ ] New behavior is covered
- [ ] Relevant unit tests pass
- [ ] Relevant component tests pass
- [ ] Relevant integration tests pass
- [ ] Relevant E2E tests pass when required
- [ ] Lint passes
- [ ] Type checking passes
- [ ] Build passes when practical

A meaningful behavior change without appropriate tests is not complete.

---

# Final Response

After completing a task, report:

1. What was changed
2. Files created or modified
3. Components extracted or reused
4. Tests created or modified
5. Test types used
6. Verification commands actually executed
7. Any remaining limitations

Never claim that tests, lint, type checking, or builds passed unless they were actually executed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->