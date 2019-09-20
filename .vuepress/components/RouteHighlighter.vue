<template>
  <div class="route">
    <div>
      <div class="method get" v-if="method.toLowerCase() === 'get'">GET</div>
      <div class="method post" v-else-if="method.toLowerCase() === 'post'">POST</div>
      <div class="method put" v-else-if="method.toLowerCase() === 'put'">PUT</div>
      <div class="method delete" v-else-if="method.toLowerCase() === 'delete'">DELETE</div>
      <div class="method" v-else>{{ method }}</div>

      <pre><code>{{ route }}</code></pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RouteHighlighter',
  props: ['method', 'route'],
  data () {
    return {

    }
  }
}
</script>

<style lang="css" scoped>

div.route {
  display: inline-block;
  width: 100%;
}

.route > div {
  display: inline;
}

.route > div.method.get {
  background-color: #3eaf7c;
  color: white;
}

.route div.method.post {
  background-color: #f5a623;
  color: white;
}

.route div.method.put {
  background-color: #2c88ea;
  color: white;
}

.route div.method.delete {
  background-color: #ef5d5a;
  color: white;
}

.route > div > div {
  line-height: 1.4;
  padding: 1.25rem 1.5rem;
  margin: 0.85rem 0;
  background-color: #3eaf7c;
  border-radius: 6px 0px 0px 6px;
  overflow: auto;
  color: white;
  font-weight: bold;
  float: left;
}

.route > div > pre {
  border-radius: 0px 6px 6px 0px;
}

</style>
