<template>
  <div class="route">
      <div>{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'linkButton',
  props: ['text'],
  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>

div.route {
  display: inline-block;
  text-align: center;
  width:100%;
  margin: 2em;
}

.route > div {
  display: inline;
  line-height: 1.4;
  padding: 1rem 1.25rem;
  margin: 0.85rem 0;
  background-color: #3eaf7c;
  border-radius: 6px 6px 6px 6px;
  overflow: auto;
  color: white;
  font-weight: bold;
  margin-left: auto;
  margin-right: auto;
  width: 200px;
}

</style>
