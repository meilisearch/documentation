<template>
  <div>
    <tabs v-if="samples" type="border-card">
      <tab
        v-for="sample in samples"
        :key="sample.language"
        :label="sample.label"
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
    }
  },
  created() {
    this.samples = CODE_SAMPLES[this.id]
  },
}
</script>
