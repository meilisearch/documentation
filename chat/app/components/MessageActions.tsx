import type { Feedback } from "../../shared/source";
import type { ChatAnalytics, TraceRef } from "../lib/analytics";
import { RegenerateIcon, ThumbDownIcon, ThumbUpIcon } from "./icons";

type Props = {
  trace: TraceRef;
  feedback: Feedback | null;
  canRegenerate: boolean;
  analytics: ChatAnalytics;
  onFeedback(rating: Feedback): void;
  onRegenerate(): void;
};

const actionClass =
  "cursor-pointer rounded-lg p-1.5 text-black/50 hover:bg-black/[0.06] hover:text-black/80 disabled:cursor-default disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white/90";

export function MessageActions({ trace, feedback, canRegenerate, analytics, onFeedback, onRegenerate }: Props) {
  const voted = feedback !== null;
  const vote = (rating: Feedback) => {
    if (voted) return;
    analytics.feedback(trace, rating);
    onFeedback(rating);
  };

  return (
    <div className="mt-1 flex items-center gap-1">
      <button
        type="button"
        aria-label="Good response"
        aria-pressed={feedback === "up"}
        disabled={voted}
        onClick={() => vote("up")}
        className={actionClass}
      >
        <ThumbUpIcon />
      </button>
      <button
        type="button"
        aria-label="Bad response"
        aria-pressed={feedback === "down"}
        disabled={voted}
        onClick={() => vote("down")}
        className={actionClass}
      >
        <ThumbDownIcon />
      </button>
      {canRegenerate && (
        <button
          type="button"
          aria-label="Regenerate response"
          onClick={() => {
            analytics.regenerated(trace);
            onRegenerate();
          }}
          className={actionClass}
        >
          <RegenerateIcon />
        </button>
      )}
    </div>
  );
}
