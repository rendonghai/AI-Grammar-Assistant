# Repository Guidelines

## Project Structure & Module Organization
Source code lives in `src/`, with React views under `src/components`, shared state in `src/context`, remote access helpers in `src/services/apiService.js`, and formatting utilities in `src/utils`. The Vite entry point (`src/main.jsx`) mounts `App.jsx`, while Tailwind styles load from `src/index.css`. Static assets sit in `public/`. Build and tooling configuration files (`vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`) stay at the project root.

## Build, Test, and Development Commands
- `pnpm install` – install dependencies before the first run.
- `pnpm run dev` – start the Vite dev server with hot reload at `http://localhost:5173`.
- `pnpm run build` – create a production bundle in `dist/`.
- `pnpm run preview` – serve the production build locally for smoke checks.
- `pnpm run lint` – run ESLint on `src/` using the shared config.
- `pnpm run deploy` – publish the latest `dist/` build to GitHub Pages (runs `build` first via `predeploy`).

## Coding Style & Naming Conventions
Use modern React with functional components and hooks. Components, contexts, and view files follow `PascalCase.jsx`; helpers and hooks prefer `camelCase.js`. Indent with two spaces, keep semicolons, and favor single quotes. Tailwind utility classes belong inline in JSX. Respect ESLint’s critical rules—fix warnings immediately so `pnpm run lint` stays clean.

## Testing Guidelines
No automated suite ships yet; add tests near related code under `src/__tests__` or co-located `*.test.jsx` files when introducing logic. Prefer Vitest plus React Testing Library to match the Vite stack. Keep coverage expectations explicit in PRs and include at least one scenario per grammar workflow or API branch you touch.

## Commit & Pull Request Guidelines
Commits in history use short, imperative summaries (e.g., “Add delete functionality…”). Keep changes scoped, explain user-facing impact in the body if needed, and include bilingual messaging only when it aids stakeholders. For PRs, provide a concise summary, link relevant issues, list manual test steps or screenshots, and call out new configuration or secrets so reviewers can validate them.

## Security & Configuration Tips
Secrets for the Baidu agent currently live in `src/services/apiService.js`; prefer `.env` variables exposed via Vite (`VITE_` prefix) before shipping. Never commit real credentials—document placeholders and update deployment notes instead. When touching API integrations, log non-sensitive details only and strip console output before merging.
