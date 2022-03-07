const path = require('path')
const renderSamples = require('./render')
const { fetchRemoteSamples, fetchLocalSample } = require('./fetch')

module.exports = (options, context) => {
  return {
    async ready() {
      if (context.isProd) {
        await fetchRemoteSamples()
      }
    },
    name: 'fetch-sample-files',
    define() {
      if (!context.isProd) {
        fetchLocalSample()
      }
      const samples = require('./generated-samples.json')
      return {
        CODE_SAMPLES: renderSamples(samples),
      }
    },
    enhanceAppFiles: [path.resolve(__dirname, './client.js')],
  }
}
