<template>
  <div class="route">
    <a v-bind:href="`${ url }`">
      <div class="method get" v-if="method.toLowerCase() === 'get'">{{ text }}</div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'linkButton',
  props: ['method', 'text', 'url'],
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
  width: 100%;
}

.route > div {
  display: inline;
}

.route > div.method.get {
  background-color: #3eaf7c;
  color: white;
}

.route > a > div {
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
