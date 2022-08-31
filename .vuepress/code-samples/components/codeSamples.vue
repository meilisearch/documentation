<template>
  <!-- The click listener updates the prefered tabs language state in ./store.js -->
  <div class="code-samples-wrapper" @click="updateLanguage">
    <!-- the active-name prop defines the current active tab -->
    <tabs v-if="samples" type="border-card" :active-name="preferedTab" class="tab-content">
      <!-- the `name` prop compares with the parent `active-name` to determine if it is the active tab or not -->
      <tab
        v-for="sample in samples"
        :key="`${sample.language}-${sample.label}`"
        :label="sample.label"
        :name="`${sample.label}`"
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
      defaultTab: undefined,
      // Because the store only keeps track of one tab, some tabs that are not relevant to store (for example: React)
      // are tagged as `cachableTab: false` in `sdks.json`.
      // Otherwise, when a user clicks. for example, on the `React` tab it would change the active tab of
      // all the other code-samples to the default `cURL`.
      ignoredTabs: [],
    }
  },
  computed: {
    preferedTab() {
      this.resolvePreferedTab()

      return this.defaultTab
    },
  },
  created() {
    this.ignoredTabs = CODE_SAMPLES[this.id].filter(tab => !tab.cachableTab).map(tab => tab.label)
    this.samples = CODE_SAMPLES[this.id]
  },
  methods: {
    /*
    * Check if the prefered language found in the store has an existing matching code-sample-id.
    * If not, defaults to the first language it finds in the list (often bash).
    */
    resolvePreferedTab: function () {
      const languages = this.samples.map(sample => sample.label)

      const storedPreferedTab = this.$store.state.preferedTab
      this.defaultTab = languages.includes(storedPreferedTab) ? storedPreferedTab : languages[0]
    },
    /*
    * Updates the tabs language state with the current active tab language.
    * Storage of the state is done in `./store.js`
    */
    updatePreferedTab: function (event) {
      const classList = [...event.target.classList] // transform DOMTokenList to Array type to make it iterable.
      if (classList.includes('el-tabs__item')) { // check if clicked element is a tab
        const tabName = event.target.id.replace('tab-', '')

        // Update the prefered tab in the store.
        // Only updates if the tab can be a prefered tab (see cachableTab in sdks.json)
        if (!this.ignoredTabs.includes(tabName)) { this.$store.commit('changePreferedTab', tabName) }
      }
    },
  },
}
</script>
