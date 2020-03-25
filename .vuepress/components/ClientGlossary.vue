<template>
    <ClientOnly><glossary :word="word"/></ClientOnly>
</template>

<script>
export default {
    name: "clientGlossary",
    props: {
        'word': {
            type: String
        }
    },
}
</script>
