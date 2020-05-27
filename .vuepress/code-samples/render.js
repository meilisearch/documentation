const vuepressmd = require('@vuepress/markdown')()

function codeBlockWrapper(sample, language) {
  return `\`\`\` ${language}\n${sample}\n\`\`\``
}

function renderCodeSample({ sample, sampleId, language }) {
  if (!sampleId.match(/.*_md$/)) {
    sample = codeBlockWrapper(sample, language)
  }
  const htmlRender = vuepressmd.render(sample)
  return htmlRender.html
}

module.exports = function (fetchedSamples) {
  /**  This reduce creates an object containing all samples-id with a list of the samples in the different languages
    ex: codeSamples = {
      create_index_1 : [
        { languages: "bash", code: "`$ curl -X GET 'http://localhost:7700/indexes", label: "curl" },
        { languages: "javascript", code: "client.createIndex('movie')", label: "javascript" }
      ]
    }
  **/
  return fetchedSamples.reduce((acc, languageSample) => {
    for (const sampleId in languageSample.samples) {
      const previousSamples = acc[sampleId] || []
      acc[sampleId] = [
        ...previousSamples,
        {
          language: languageSample.language, // markdown code block language highlight ex: ```javascript ````
          label: languageSample.label, // name of the tab ex: curl
          code: renderCodeSample({
            sample: languageSample.samples[sampleId],
            sampleId,
            language: languageSample.language,
          }), // code rendered in HTML
        },
      ]
    }
    return acc
  }, {})
}
