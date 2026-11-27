const STORAGE_KEY = "meili-chat:conversation";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let memoryId: string | undefined;

function remember(id: string): string {
  memoryId = id;
  try {
    sessionStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage full or unavailable: the chat still works, it just won't persist.
  }
  return id;
}

export function loadConversationId(): string {
  if (memoryId) return memoryId;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && UUID.test(stored)) return remember(stored);
  } catch {
    // Storage blocked: a new id lives in memory for this page.
  }
  return remember(crypto.randomUUID());
}

export function resetConversationId(): string {
  return remember(crypto.randomUUID());
}
