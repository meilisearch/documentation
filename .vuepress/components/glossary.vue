<template>
  <span>
    <span
      class="tooltip-text"
      @mouseover="showTooltip"
      @mouseleave="hideTooltip"
    >
      {{ displayed }}
    </span>
    <div class="tooltip-content" v-html="content" />
  </span>
</template>

<script>
import { createPopper } from '@popperjs/core'

const glossary = {
  field:
    "A field, or a key-value pair, is a set of two data items linked together: an <b>attribute</b> and its associated <b>value</b>. <br><br> Ex: <code>attribute: 'value'</code>",
  attribute:
    "An attribute is the name of a field, like a key. <br><br> Ex:  <code>title: 'Batman'</code> <br> In the example above, title is the attribute.",
  'ranking rules':
    'A set of consecutive rules applied to ensure relevancy in search results. <br><br> For example, to sort results by number of typos or number of matched query terms in each matching document.',
  'primary key':
    'The attribute of the field which contains the unique identifier of the documents. <br><br> It is used by MeiliSearch to store the document. <br><br> Example: <code>movie_id</code> is the primary key of a movie document.',
  schemaless:
    "This means data can be indexed without providing a fixed data structure. <br><br> For example, SQL's tables require schema definition whereas MongoDB's collections don't.",
  searchable:
    'The data is used to determine the relevancy of a document when doing a search query.',
  displayed: 'The field is present in the documents returned upon search.',
}

export default {
  props: {
    word: {
      type: String,
      default: 'field',
      validator: function (x) {
        return glossary[x]
      },
    },
    label: {
      type: String,
      default: null,
    },
  },
  data: () => {
    return {
      glossary,
      displayed: '',
      content: '',
    }
  },
  created() {
    console.log(this.label, this.word)
    this.displayed = this.label || this.word
    this.content =
      glossary[this.word] + "<div id='arrow' data-popper-arrow></div>"
  },
  mounted() {
    const text = this.$el.querySelector('.tooltip-text')
    const tooltip = this.$el.querySelector('.tooltip-content')
    createPopper(text, tooltip, {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    })
    this.hideTooltip()
  },
  methods: {
    showTooltip() {
      this.$el
        .querySelector('.tooltip-content')
        .classList.remove('tooltip-hide')
    },
    hideTooltip() {
      this.$el.querySelector('.tooltip-content').classList.add('tooltip-hide')
    },
  },
}
</script>

<style>
.tooltip-hide {
  visibility: hidden;
}
#arrow,
#arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  z-index: -1;
}
#arrow::before {
  content: '';
  transform: rotate(45deg);
  background: #333;
}
.tooltip-text {
  font-style: italic;
  border-bottom: 1px dotted grey;
  position: relative;
}
.tooltip-content {
  display: inline-block;
  font-family: inherit !important;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  font-size: 0.9rem;
  border-radius: 4px;
  z-index: 100;
  max-width: 500px;
}
.tooltip-content code {
  font-size: 0.9rem;
  color: #7ec699;
  background-color: rgba(18, 0, 0, 0.5);
}
</style>
