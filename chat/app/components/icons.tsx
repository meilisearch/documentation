import type { ReactNode } from "react";

export function SparkleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function TrashIcon() {
  return (
    <Icon>
      <path d="M3.75 5h10.5" />
      <path d="M7.25 5V3.75h3.5V5" />
      <path d="M5.25 5l.7 9.25h6.1L12.75 5" />
    </Icon>
  );
}

export function ExpandIcon() {
  return (
    <Icon>
      <path d="M10.75 2.75H15.25V7.25" />
      <path d="M15.25 2.75L10.75 7.25" />
      <path d="M2.75 10.75V15.25H7.25" />
      <path d="M2.75 15.25L7.25 10.75" />
    </Icon>
  );
}

export function CollapseIcon() {
  return (
    <Icon>
      <path d="M15.25 7.25H10.75V2.75" />
      <path d="M10.75 7.25L15.25 2.75" />
      <path d="M7.25 15.25V10.75H2.75" />
      <path d="M7.25 10.75L2.75 15.25" />
    </Icon>
  );
}

export function CloseIcon() {
  return (
    <Icon>
      <path d="M14 4L4 14" />
      <path d="M4 4L14 14" />
    </Icon>
  );
}

export function ThumbUpIcon() {
  return (
    <Icon>
      <path d="M5.25 7.5v9" />
      <path d="M11.25 4.41 10.5 7.5h4.37a1.5 1.5 0 0 1 1.44 1.92l-1.75 6A1.5 1.5 0 0 1 13.13 16.5H3a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h2.07a1.5 1.5 0 0 0 1.34-.83L9 1.5a2.35 2.35 0 0 1 2.25 2.91Z" />
    </Icon>
  );
}

export function ThumbDownIcon() {
  return (
    <Icon>
      <path d="M12.75 10.5V1.5" />
      <path d="M6.75 13.59 7.5 10.5H3.13a1.5 1.5 0 0 1-1.44-1.92l1.75-6A1.5 1.5 0 0 1 4.88 1.5H15a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-2.07a1.5 1.5 0 0 0-1.34.83L9 16.5a2.35 2.35 0 0 1-2.25-2.91Z" />
    </Icon>
  );
}

export function RegenerateIcon() {
  return (
    <Icon>
      <path d="M2.25 9a6.75 6.75 0 1 0 6.75-6.75 7.31 7.31 0 0 0-5.06 2.06L2.25 6" />
      <path d="M2.25 2.25v3.75h3.75" />
    </Icon>
  );
}
