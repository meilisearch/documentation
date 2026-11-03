# AGENTS.md

## Cloud Agent environment

Canonical setup and commands stay in [CONTRIBUTING.md](CONTRIBUTING.md). These details are easy to miss when running the docs in a Cloud Agent:

- Mintlify requires Node.js 20.17 or newer and refuses Node.js 25. Node.js 22 on the default Cloud Agent image is enough. `.nvmrc` lists 23, and CI uses Node.js 20. Do not install another Node.js version unless `mint dev` fails its version check.
- Install dependencies with `npm ci`. The local preview client is stored in `~/.mintlify` and is downloaded from `releases.mintlify.com` when it is missing.
- Start the site with `npx mint dev --no-open`. It listens on `http://localhost:3000`. `/` redirects to `/getting_started/overview`.
- Reading pages does not require a Mintlify account. Full-text search in the preview requires `mint login`.
