import { CloseIcon, CollapseIcon, ExpandIcon, SparkleIcon, TrashIcon } from "./icons";

const iconButtonClass =
  "cursor-pointer rounded-lg p-1.5 text-black/50 hover:bg-black/[0.06] hover:text-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white/90";

export function ChatHeader({
  desktop,
  hasMessages,
  maximized,
  onClear,
  onToggleSize,
  onClose,
}: {
  desktop: boolean;
  hasMessages: boolean;
  maximized: boolean;
  onClear: () => void;
  onToggleSize: () => void;
  onClose: () => void;
}) {
  return (
    <header className={`flex shrink-0 items-center justify-between ${desktop ? "h-16 px-12" : "h-14 px-5"}`}>
      <h2 className="meili-chat-title">
        <SparkleIcon />
        <span className="truncate">Ask Meilisearch</span>
      </h2>
      <div className="flex shrink-0 items-center gap-1">
        {hasMessages && (
          <button type="button" onClick={onClear} aria-label="Clear chat history" className={iconButtonClass}>
            <TrashIcon />
          </button>
        )}
        {desktop && (
          <button
            type="button"
            onClick={onToggleSize}
            aria-label={maximized ? "Minimize assistant panel" : "Maximize assistant panel"}
            className={iconButtonClass}
          >
            {maximized ? <CollapseIcon /> : <ExpandIcon />}
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close assistant panel" className={iconButtonClass}>
          <CloseIcon />
        </button>
      </div>
    </header>
  );
}
