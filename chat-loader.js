// Loads the "Ask AI" chat widget (source in /chat, built with Vite and hosted on Vercel).
// Mintlify serves this file on every page; the widget itself is not part of the docs build.
//
// Mintlify cannot read Vercel's env vars. A preview hostname already ends with the branch
// slug Vercel puts in VERCEL_BRANCH_URL:
//   meilisearch-6b28dec2-<branch>.mintlify.site
//   -> documentation-chat-git-<branch>-meili.vercel.app
// The bundle then calls the API on the origin baked in from that env var.

const MEILI_CHAT_PROD_URL = 'https://documentation-chat.vercel.app'
// Used only when `npm run dev` is running in chat/. 127.0.0.1 avoids an IPv6-only bind.
const MEILI_CHAT_DEV_URL = 'http://127.0.0.1:5173'
const MINTLIFY_PREVIEW = /^meilisearch-6b28dec2-(.+)\.mintlify\.site$/
// DNS labels are at most 63 characters. Vercel truncates the branch alias to fit.
const BRANCH_PREFIX = 'documentation-chat-git-'
const BRANCH_SUFFIX = '-meili'

function branchChatUrl(hostname) {
  const match = hostname.match(MINTLIFY_PREVIEW)
  if (!match || !/^[a-z0-9-]+$/.test(match[1])) return ''
  const room = 63 - BRANCH_PREFIX.length - BRANCH_SUFFIX.length
  const branch = match[1].slice(0, room).replace(/-+$/, '')
  if (!branch) return ''
  return `https://${BRANCH_PREFIX}${branch}${BRANCH_SUFFIX}.vercel.app`
}

function loadMeilisearchChat() {
  if (window.__meiliChatLoaded) {
    return
  }

  const { hostname } = window.location
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1'
  // Local docs always use the chat dev server (`npm run dev` in chat/).
  const base = (isLocal ? MEILI_CHAT_DEV_URL : branchChatUrl(hostname) || MEILI_CHAT_PROD_URL).replace(/\/$/, '')
  window.__meiliChatLoaded = true

  const script = document.createElement('script')
  script.src = `${base}/chat.js`
  script.async = true
  script.onload = () => window.MeiliChat && window.MeiliChat.mount({ apiBase: base })
  script.onerror = () => {
    window.__meiliChatLoaded = false
    console.warn('Meilisearch chat widget failed to load from', script.src)
  }
  document.head.appendChild(script)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadMeilisearchChat)
} else {
  loadMeilisearchChat()
}
