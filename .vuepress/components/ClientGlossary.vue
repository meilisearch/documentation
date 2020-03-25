<template>
  <ClientOnly><glossary :word="word" /></ClientOnly>
</template>

<script>
export default {
  name: "ClientGlossary",
  props: {
    word: {
      type: String,
      default: "",
    },
  },
};
</script>
