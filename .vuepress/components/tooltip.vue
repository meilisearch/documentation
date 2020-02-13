<template>
    <span>
        <span class="tooltip-text"  v-tooltip.top.hover.focus="{
            ref: 'tooltipRef',
            class: 'tooltip-custom'
        }">{{ text }}</span>
        <!-- <div id="tooltipHtml" class="tooltip-content">
            <slot></slot>
        </div> -->
         <div ref="tooltipRef" class="tooltip-content">
            <!-- <p>Let's use some HTML in this tooltip</p>
            <ol>
            <li>set <b>v-tooltip</b> with the <b>ref</b> attribute</li>
            </ol> -->
            <slot></slot>
        </div>
    </span>
</template>

<script>
export default {
    name: 'tooltip',
    props: {
        info: {
          default: 'info box',
          type: String
      },
      text: {
          default: 'text',
          type: String
      }
  },
   data () {
    return {

    }
  }
};
</script>

<style lang="scss">
@import "~vue-directive-tooltip/src/css/index.scss";
.tooltip-text{
    font-style: italic;
    border-bottom: 1px dotted gray;
    position: relative;
}
.tooltip-text:after {
    content: "";
    color: gray;
    font-size: 9px;
    position: absolute;
    top: 0px;
    right: -7px;
}
.vue-tooltip.tooltip-custom {
  background-color: rgba(0,0,0,0.8);
  padding: 15px 20px;
}


</style>
