// Loads the "Ask AI" chat widget (source in /chat, built with Vite and hosted on Vercel).
// Mintlify serves this file on every page; the widget itself is not part of the docs build.

// Production URL of the Vercel project hosting chat.js and /api/chat.
// Leave empty until the project is deployed: the widget is then skipped in production.
const MEILI_CHAT_PROD_URL = '';

(function loadMeilisearchChat() {
  if (window.__meiliChatLoaded) {
    return
  }

  // Local development: localStorage.setItem('meili-chat-dev', 'http://localhost:5173')
  let devUrl = null
  try {
    devUrl = localStorage.getItem('meili-chat-dev')
  } catch (e) {
    // localStorage can be blocked; ignore.
  }

  const base = (devUrl || MEILI_CHAT_PROD_URL).replace(/\/$/, '')
  if (!base) {
    return
  }
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
