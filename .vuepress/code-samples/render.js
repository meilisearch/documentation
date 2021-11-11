const vuepressmd = require('@vuepress/markdown')()

function codeBlockWrapper(sample, language) {
  // remove if the text is `This code sample has not been added yet :(`
  return `\`\`\` ${language}\n${sample}\n\`\`\``
}

function renderCodeSample({ sampleBody, sampleId, language }) {
  if (!sampleId.match(/.*_md$/)) {
    sampleBody = codeBlockWrapper(sampleBody, language)
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
      const sampleBody = samples[sampleId]

      if (sampleBody) {
        const previousSamples = allSamples[sampleId] || []

        allSamples[sampleId] = [
          ...previousSamples,
          {
            language, // language identifier. Ex: csharp
            label, // label appearing on the tab
            code: renderCodeSample({ // render in HTML
              sampleBody,
              sampleId,
              language, // code block language ex: ```javascript ````
            }),
          },
        ]
      }
    }
    return allSamples
  }, {})
}
