export type Identity = { distinctId: string; sessionId?: string };

export type IdentityEnv = { posthog?: unknown; storage: Pick<Storage, "getItem">; cookie: string };

function persistedIdentity(raw: string): Identity | null {
  try {
    const data = JSON.parse(raw) as { distinct_id?: unknown; $sesid?: unknown };
    if (!data || typeof data !== "object") return null;
    if (typeof data.distinct_id !== "string" || data.distinct_id === "") return null;
    const identity: Identity = { distinctId: data.distinct_id };
    if (Array.isArray(data.$sesid) && typeof data.$sesid[1] === "string") identity.sessionId = data.$sesid[1];
    return identity;
  } catch {
    return null;
  }
}

function optedOutByClient(posthog: unknown): boolean {
  if (!posthog || typeof posthog !== "object") return false;
  const client = posthog as { has_opted_out_capturing?: unknown };
  return typeof client.has_opted_out_capturing === "function" && client.has_opted_out_capturing() === true;
}

function posthogIdentity(posthog: unknown): Identity | undefined {
  if (!posthog || typeof posthog !== "object") return undefined;
  const client = posthog as { get_distinct_id?: unknown; get_session_id?: unknown };
  if (typeof client.get_distinct_id !== "function" || typeof client.get_session_id !== "function") return undefined;
  const distinctId = client.get_distinct_id();
  if (typeof distinctId !== "string" || distinctId === "") return undefined;
  const identity: Identity = { distinctId };
  const sessionId = client.get_session_id();
  if (typeof sessionId === "string" && sessionId !== "") identity.sessionId = sessionId;
  return identity;
}

function browserEnv(): IdentityEnv {
  return {
    posthog: (window as Window & { posthog?: unknown }).posthog,
    storage: localStorage,
    cookie: document.cookie,
  };
}

function cookieValue(cookie: string, name: string): string | null {
  for (const part of cookie.split(";")) {
    const trimmed = part.trim();
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    if (trimmed.slice(0, separator) === name) return trimmed.slice(separator + 1);
  }
  return null;
}

export function readPostHogIdentity(token: string, env?: IdentityEnv): Identity | null {
  if (!token) return null;
  try {
    return readIdentity(env ?? browserEnv(), token);
  } catch {
    return null;
  }
}

function readIdentity(resolved: IdentityEnv, token: string): Identity | null {
  const optedOut =
    optedOutByClient(resolved.posthog) ||
    resolved.storage.getItem(`__ph_opt_in_out_${token}`) === "0" ||
    cookieValue(resolved.cookie, `__ph_opt_in_out_${token}`) === "0";
  if (optedOut) return null;

  const fromClient = posthogIdentity(resolved.posthog);
  if (fromClient) return fromClient;

  const raw = resolved.storage.getItem(`ph_${token}_posthog`);
  if (raw != null) return persistedIdentity(raw);

  const encoded = cookieValue(resolved.cookie, `ph_${token}_posthog`);
  if (encoded == null) return null;
  try {
    return persistedIdentity(decodeURIComponent(encoded));
  } catch {
    return null;
  }
}
