<template>
    <span>
        <span
            class="tooltip-text"
            v-on:mouseover="showTooltip"
            v-on:mouseleave="hideTooltip"
        >{{ word }}</span>
        <div class="tooltip-content" v-html="content"></div>
    </span>
</template>

<script>
import { createPopper } from '@popperjs/core';

const glossary = {
    'field': "A field is composed of an <b>attribute</b> and its associated data. <br><br> Ex: <code>attribute: 'data'</code>",
    'attribute': "The key associated to some data in a field. <br><br> Ex:  <code>title: 'batman'</code> <br> title is the attribute in this example.",
    'ranking rules': "Rules that are used by MeiliSearch to determine the relevancy of a document. <br><br> For example, the number of typos or the number of times the matching query is found in a document.",
    'primary key': 'The attribute in a document of its unique identifier field. <br><br> Used by MeiliSearch to store the document. <br><br> Example: `movie_id` is the primary key of a movie document.',
    'schemaless': 'This means you don\'t need to define or describe the structure of your data before adding data to an index. <br><br> For example, SQL\'s tables need schemas but mongodb\'s collections does not require it.',
    'searchable': 'The data is used to determine the relevancy of a document when doing a search query.',
    'displayed': 'The field is present in the document returned upon search.'
}

export default {
    props: {
        'word': {
            type: String,
            validator: function (x) {
                return glossary[x];
            }
        }
    },
    data: () => {
        return {
            glossary,
            content: ""
        }
    },
    created () {
        this.content = glossary[this.word] + "<div id='arrow' data-popper-arrow></div>"
    },
    methods: {
        showTooltip() {
            this.$el.querySelector('.tooltip-content').classList.remove("tooltip-hide");
        },
        hideTooltip() {
            this.$el.querySelector('.tooltip-content').classList.add("tooltip-hide");
        }
    },
    mounted() {
        const text = this.$el.querySelector('.tooltip-text');
        const tooltip = this.$el.querySelector('.tooltip-content');

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
        });
        this.hideTooltip()
    }
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
        padding: 4px 8px;
        font-size: 13px;
        border-radius: 4px;
        z-index: 100;
        max-width: 500px;
    }

 </style>
