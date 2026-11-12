export type ChatUser = {
  /** Tab title from Mintlify, e.g. "JS" or "HTTP request". */
  codeLanguage: string | null;
};

/** Mintlify stores the last code-sample tab as JSON in localStorage["code"]. */
export function readChatUser(): ChatUser {
  try {
    const raw = localStorage.getItem("code");
    const value = raw ? JSON.parse(raw) : null;
    return { codeLanguage: typeof value === "string" && value.trim() ? value : null };
  } catch {
    return { codeLanguage: null };
  }
}
