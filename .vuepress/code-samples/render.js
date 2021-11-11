const vuepressmd = require('@vuepress/markdown')()

function codeBlockWrapper(sample, codeBlockLanguage) {
  return `\`\`\` ${codeBlockLanguage}\n${sample}\n\`\`\``
}

function renderCodeSample({ sampleBody, sampleId, codeBlockLanguage }) {
  if (!sampleId.match(/.*_md$/)) {
    sampleBody = codeBlockWrapper(sampleBody, codeBlockLanguage)
  }
  const htmlRender = vuepressmd.render(sampleBody)
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
  return fetchedSamples.reduce((allSamples, sampleSet) => {
    const { samples, language, label } = sampleSet

    for (const sampleId in samples) {
      const previousSamples = allSamples[sampleId] || []

      const sampleBody = samples[sampleId] || 'This code sample has not been added yet :('
      const codeBlockLanguage = samples[sampleId] ? language : ''

      allSamples[sampleId] = [
        ...previousSamples,
        {
          language, // language identifier. Ex: csharp
          label, // label appearing on the tab
          code: renderCodeSample({ // render in HTML
            sampleBody,
            sampleId,
            codeBlockLanguage, // code block language ex: ```javascript ````
          }),
        },
      ]
    }
    return allSamples
  }, {})
}
