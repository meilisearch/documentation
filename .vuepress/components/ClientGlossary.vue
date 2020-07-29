<template>
  <!-- prettier-ignore-->
  <ClientOnly><glossary :word="word" :label="label" /></ClientOnly>
</template>

<script>
export default {
  name: 'ClientGlossary',
  props: {
    word: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: null,
    },
  },
}
</script>
