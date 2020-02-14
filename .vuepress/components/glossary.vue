<template>
    <tooltip :text="word" > <span v-html="glossary[word]"></span></tooltip>
</template>

<script>

const glossary = {
    'field' : "A field is composed of an <b>attribute</b> and its associated data. <br><br> Ex: <code>attribute: 'data'</code> <br><br> The collection of fields is a document.",
    'attribute': "The key associated to some data in a field  <br><br> Ex:  <code>title: 'batman'</code> <br> title is the attribute in this example.",
    'ranking rules': "Rules that are used by MeiliSearch to determine the relevancy of a document. <br><br> For example, the number of typos or the number of times the matching query is found in a document"
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
            glossary
        }
    }
}
</script>

