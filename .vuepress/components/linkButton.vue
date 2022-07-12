<template>
  <ClientOnly>
    <div class="route">
      <div>{{ text }}</div>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  name: 'LinkButton',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  updated: () => {
    const el = document.querySelector('div.route')
    if (el) {
      el.parentElement.style.display = 'block'
      el.parentElement.style.width = 'fit-content'
      el.parentElement.style.margin = 'auto'
    }
  },
}
</script>

<style lang="css" scoped>
div.route {
  display: block;
  text-align: center;
  margin: 3em 0;
}

.route > div {
  display: inline;
  line-height: 1.4;
  padding: 1.25rem 1.75rem;
  margin: 0.85rem 0;
  background-color: #4F55E3;
  border-radius: 71.3971px;
  overflow: auto;
  color: white;
  font-weight: bold;
  margin-left: auto;
  margin-right: auto;
}
.route > div:hover {
  background-color: #4348C1;
}
</style>
