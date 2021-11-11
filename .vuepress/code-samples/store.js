import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const DEFAULT_TAB = 'bash'
const STORAGE_KEY = 'tabsLanguage'

const initialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_TAB
  } else {
    return DEFAULT_TAB
  }
}
export default new Vuex.Store({
  state: {
    // Uses the stored language in the local storage
    // if it does not exists, default to `bash`
    tabsLanguage: initialLanguage(),
  },
  mutations: {
    changeTabsLanguage(state, language) {
      // Adds the prefered tab language to the local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, language)
      }

      // Update the language state. It will reflect on all code-samples tabs
      state.tabsLanguage = language
    },
  },
})
