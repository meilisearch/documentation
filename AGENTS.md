# AGENTS.md

## Cloud Agent environment

Canonical setup and commands stay in [CONTRIBUTING.md](CONTRIBUTING.md). These details are easy to miss when running the docs in a Cloud Agent:

- Mintlify refuses Node.js 25. This repo and CI use Node.js 22 (`.nvmrc`). Ingestion calls `path.matchesGlob`, which needs Node.js 22. Do not install another Node.js version unless `mint dev` fails its version check.
- Install dependencies with `npm ci`. The local preview client is stored in `~/.mintlify` and is downloaded from `releases.mintlify.com` when it is missing.
- Start the site with `npx mint dev --no-open`. It listens on `http://localhost:3000`. `/` redirects to `/getting_started/overview`.
- Reading pages does not require a Mintlify account. Full-text search in the preview requires `mint login`.

## Tests

`npm test` runs the unit tests. `npm run test:scripts` is ingestion and `chat/shared/`. `npm run test:chat` is the assistant and the widget. `npm run test:integration` needs a local Meilisearch and fails when `MEILI_TEST_URL` is unset. The commands are in [CONTRIBUTING.md](CONTRIBUTING.md).

Write the failing test first. Name it after the behavior. Node tests cover `scripts/ingest/`, `chat/agent/`, and `chat/shared/`. jsdom tests cover `chat/app/`.

## Moving pages

Putting an existing page under another navigation group, tab, or section is a page move, even when the request only names the group. Use the `move-page` skill: it moves the file to a path that matches the new group, updates `config/navigation.json` and internal links, and adds redirects in `config/redirects.json`. Do not only edit `config/navigation.json`.
