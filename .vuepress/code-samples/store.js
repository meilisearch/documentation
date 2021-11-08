import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Uses the stored language in the local storage
    // if it does not exists, default to `bash`
    tabsLanguage: localStorage.getItem('tabsLanguage') || 'bash',
  },
  mutations: {
    changeTabsLanguage(state, language) {
      // Adds the prefered tab language to the local storage
      localStorage.setItem('tabsLanguage', language)
      // Update the language state. It will reflect on all code-samples tabs
      state.tabsLanguage = language
    },
  },
})
