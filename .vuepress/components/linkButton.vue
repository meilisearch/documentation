<template>
  <div class="route">
    <div>{{ text }}</div>
  </div>
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
  background-color: #3eaf7c;
  border-radius: 6px 6px 6px 6px;
  overflow: auto;
  color: white;
  font-weight: bold;
  margin-left: auto;
  margin-right: auto;
}
</style>
