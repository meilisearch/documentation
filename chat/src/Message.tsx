import type { UIMessage } from "ai";
import { memo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { collectSources, expandedPageLabel, isExpandPart, isSearchPart, linkTarget, searchQuery, Sources } from "./Sources";

function ToolStatus({ state, label }: { state: string; label: string }) {
  const done = state === "output-available";
  const failed = state === "output-error";
  return (
    <div className="my-1 flex items-center gap-2 text-[12.5px] text-black/50 dark:text-white/50">
      <span className={done || failed ? "" : "animate-pulse"}>{failed ? "!" : done ? "✓" : "●"}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function Link({ href, children }: ComponentProps<"a">) {
  return (
    <a href={href} {...(href ? linkTarget(href) : {})}>
      {children}
    </a>
  );
}

const components = { a: Link };

export const Message = memo(function Message({ message, streaming }: { message: UIMessage; streaming: boolean }) {
  if (message.role === "user") {
    const text = message.parts.map((part) => (part.type === "text" ? part.text : "")).join("");
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2 text-[14px] whitespace-pre-wrap text-white">
          {text}
        </div>
      </div>
    );
  }

  const sources = collectSources(message.parts);

  return (
    <div>
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <div key={index} className="meili-prose">
              <Streamdown
                components={components}
                isAnimating={streaming && index === message.parts.length - 1}
                linkSafety={{ enabled: false }}
                controls={false}
              >
                {part.text}
              </Streamdown>
            </div>
          );
        }

        if (isSearchPart(part)) {
          const q = searchQuery(part);
          const verb =
            part.state === "output-error"
              ? "Search failed"
              : part.state === "output-available"
                ? "Searched the docs"
                : "Searching the docs";
          return <ToolStatus key={index} state={part.state} label={`${verb}${q ? `: “${q}”` : ""}`} />;
        }

        if (isExpandPart(part)) {
          const page = expandedPageLabel(part);
          const verb =
            part.state === "output-error"
              ? "Could not read the page"
              : part.state === "output-available"
                ? "Read the full page"
                : "Reading the full page";
          return <ToolStatus key={index} state={part.state} label={`${verb}${page ? `: ${page}` : ""}`} />;
        }

        return null;
      })}
      <Sources sources={sources} />
    </div>
  );
});
