# AI assistant app

React widget and docs agent, deployed on Vercel as its own project. The Mintlify site loads the widget through `/chat-loader.js`.

```text
api/        HTTP entry. One file, one function: re-exports the agent handler.
agent/      The docs assistant. Instructions, tools, and the request handler.
app/        Browser widget. Components, hooks, and widget-only helpers.
shared/     Pure helpers imported by the agent, the widget, and ingestion.
```

`api/` stays thin because Vercel turns every file under it into a function. Agent code lives in `agent/`, next to `app/`, and both import `shared/` only. The widget does not import the agent. The agent does not import the widget.

## Known temporary code

`agent/transcript.ts` prints a retrieval trace to the Vercel logs. Delete it when real observability replaces that trace. It is the only reader of `AgentContext.details`; removing it drops the `transcript.js` import in `agent/agent.ts` and nothing else.
