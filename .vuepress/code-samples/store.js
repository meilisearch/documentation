import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const DEFAULT_LABEL = 'cURL'
const STORAGE_KEY = 'preferredTab'

const initialTab = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LABEL
  } else {
    return DEFAULT_LABEL
  }
}
export default new Vuex.Store({
  state: {
    // Uses the stored tab in the local storage
    // if it does not exists, default to `cURL`
    preferredTab: initialTab(),
  },
  mutations: {
    changePreferredTab(state, tab) {
      // Adds the preferred tab to the local storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, tab)
      }

      // Updates the tab. It will reflect on all code-samples tabs
      state.preferredTab = tab
    },
  },
})
