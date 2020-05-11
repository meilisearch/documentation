const path = require('path')
const renderSamples = require('./render')
const { fetchRemoteSamples, fetchLocalSample } = require('./fetch')

module.exports = (options, context) => {
  return {
    async ready() {
      await fetchRemoteSamples(options, context)
    },
    beforeDevServer() {
      fetchLocalSample()
    },
    name: 'fetch-sample-files',
    define() {
      const samples = require('./generated-samples.json')
      return {
        CODE_SAMPLES: renderSamples(samples),
      }
    },
    enhanceAppFiles: [path.resolve(__dirname, './client.js')],
  }
}
