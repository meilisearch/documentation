<template>
  <!-- The click listener updates the prefered tabs language state in ./store.js -->
  <div @click="updateLanguage">
    <!-- the active-name prop defines the current active tab -->
    <tabs v-if="samples" type="border-card" :active-name="tabsLanguage">
      <!-- the `name` prop compares with the parent `active-name` to determine if it is the active tab or not -->
      <tab
        v-for="sample in samples"
        :key="sample.language"
        :label="sample.label"
        :name="sample.language"
      >
        <div v-html="sample.code" />
      </tab>
    </tabs>
    <tabs v-else type="border-card">
      No example found
    </tabs>
  </div>
</template>

<script>
// globals CODE_SAMPLES
export default {
  name: 'CodeSamples',
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      samples: undefined,
      preferedLanguage: undefined,
    }
  },
  computed: {
    tabsLanguage() {
      this.resolvePreferedTabsLanguage()
      return this.preferedLanguage
    },
  },
  created() {
    this.samples = CODE_SAMPLES[this.id]
  },
  methods: {
    /*
    * Check if the prefered language found in the store has an existing matching code-sample-id.
    * If not, defaults to the first language it finds in the list (often bash).
    */
    resolvePreferedTabsLanguage: function () {
      const languages = this.samples.map(sample => sample.language)
      const storedTabsLanguage = this.$store.state.tabsLanguage
      this.preferedLanguage = languages.includes(storedTabsLanguage) ? storedTabsLanguage : languages[0]
    },
    /*
    * Updates the tabs language state with the current active tab language.
    * Storage of the state is done in `./store.js`
    */
    updateLanguage: function (event) {
      const classList = [...event.target.classList] // transform DOMTokenList to Array type to make it iterable.
      if (classList.includes('el-tabs__item')) { // check if clicked element is a tab
        const tabsLanguage = event.target.id.replace('tab-', '')
        this.$store.commit('changeTabsLanguage', tabsLanguage)
      }
    },
  },
}
</script>
