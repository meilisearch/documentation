# AI assistant app

React widget and docs agent, deployed on Vercel as its own project. The Mintlify site loads the widget through `/chat-loader.js`.

```text
api/        HTTP entry. Two files, chat.ts and events.ts. Each re-exports one agent handler.
agent/      The docs assistant. Instructions, the router, tools, and the request handler.
app/        Browser widget. Components, hooks, and widget-only helpers.
shared/     Pure helpers imported by the agent, the widget, and ingestion.
```

`api/` stays thin because Vercel turns every file under it into a function. Agent code lives in `agent/`, next to `app/`, and both import `shared/` only. The widget does not import the agent. The agent does not import the widget.

## Tests

From the repository root:

```bash
npm test
npm run chat:test
```

`npm test` runs the assistant, the widget, and ingestion. `npm run chat:test` runs the assistant and the widget. Widget tests use jsdom. Assistant tests stay in Node and mock Meilisearch.

Put a test in `__tests__/` next to the module. Write the failing test first, and name it after the behavior. Import the module with a `.ts` specifier. Production code keeps the `.js` specifier, because Vercel does not rewrite it.

## Observability

PostHog traces one assistant message as `$ai_trace_id` and one conversation as `$ai_session_id`. Clicks go to `/api/events`. The environment variables are `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. Missing configuration never breaks the chat.
