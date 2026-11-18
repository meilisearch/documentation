// Loads the "Ask AI" chat widget (source in /chat, built with Vite and hosted on Vercel).
// Mintlify serves this file on every page; the widget itself is not part of the docs build.

// Stable production alias. It keeps working after a custom domain is added.
const MEILI_CHAT_PROD_URL = 'https://documentation-chat.vercel.app'
// Run `npm run dev` in chat/ to load the widget on local docs.
const MEILI_CHAT_DEV_URL = 'http://localhost:5173'

(function loadMeilisearchChat() {
  if (window.__meiliChatLoaded) {
    return
  }

  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  const base = (isLocal ? MEILI_CHAT_DEV_URL : MEILI_CHAT_PROD_URL).replace(/\/$/, '')
  window.__meiliChatLoaded = true

  const start = () => {
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
    document.addEventListener('DOMContentLoaded', start)
  } else {
    start()
  }
})()
