<template>
    <tooltip :text="word" > <span v-html="glossary[word]"></span></tooltip>
</template>

<script>

const glossary = {
    'field' : "A field is composed of an <b>attribute</b> and its associated data. <br><br> Ex: <code>attribute: 'data'</code> <br><br> The collection of fields is a document.",
    'attribute': "The key associated to some data in a field  <br><br> Ex:  <code>title: 'batman'</code> <br> title is the attribute in this example.",
    'ranking rules': "Rules that are used by MeiliSearch to determine the relevancy of a document. <br><br> For example, the number of typos or the number of times the matching query is found in a document",
    'document identifier': 'The attribute in a document of his unique identifier. <br><br> Used by MeiliSearch to store the document. <br><br> Example: `movie_id` is the document identifier of a movie document',
    'schemaless': 'This mean you don\'t need to define or describe the structure of your data before adding data to an index. <br><br> For example, SQL\'s tables need schemas but mongodb\'s collections does not require it'
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

