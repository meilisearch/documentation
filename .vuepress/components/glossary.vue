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
    'A field, or a key-value pair, is a set of two data items linked together: an <b>attribute</b> and its associated <b>value</b>. <br><br> Ex: <code>"attribute": "value"</code>',
  attribute:
    'An attribute is the name of a field, like a key. <br><br> Ex:  <code>"title": "Batman"</code> <br> In the example above, "title" is the attribute.',
  value:
    'A piece of data linked to an attribute. One half of a field. <br><br> Ex:  <code>"title": "Batman"</code> <br> In the example above, "Batman" is the value.',
  'ranking rules':
    'A set of consecutive rules applied to ensure relevancy in search results. <br><br> For example, to sort results by number of typos or number of matched query terms in each matching document.',
  'primary field':
    'A special field containing the primary key and a unique document id. <br><br> Every document must possess a correctly formatted primary field in order to be indexed.',
  'primary key':
    'An attribute that must be present in every document of a given index, used to identify and distinguish documents.<br><br> Example: In a document with the primary field <code>"id": "Abc_012"</code>, "id" is the index's primary key and "Abc_012" is the document's unique identifier.',
  'document id':
    'The value of the primary field. The document id acts as a unique identifier for storing documents. <br><br> Example: in a document with the primary field <code>"movie_id": "Abc_012"</code>, "Abc_012" is the document id.',
  schemaless:
    'This means data can be indexed without providing a fixed data structure. <br><br> For example, SQL\'s tables require schema definition whereas MongoDB\'s collections don\'t.',
  searchable:
    'The data is used to determine the relevancy of a document when doing a search query.',
  displayed:
    'The field is present in the documents returned upon search.',
  atomic:
    'An atomic transaction is an indivisible and irreducible series of database operations such that either all occur, or nothing occurs.',
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
