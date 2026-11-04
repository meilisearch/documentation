import type { UIMessage } from "ai";
import { memo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";
import { collectSources, isSearchPart, linkTarget, searchQuery, Sources } from "./Sources";

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
          const done = part.state === "output-available";
          const failed = part.state === "output-error";
          return (
            <div key={index} className="my-1 flex items-center gap-2 text-[12.5px] text-black/50 dark:text-white/50">
              <span className={done || failed ? "" : "animate-pulse"}>{failed ? "!" : done ? "✓" : "●"}</span>
              <span className="truncate">
                {failed ? "Search failed" : done ? "Searched the docs" : "Searching the docs"}
                {q ? `: “${q}”` : ""}
              </span>
            </div>
          );
        }

        return null;
      })}
      <Sources sources={sources} />
    </div>
  );
});
