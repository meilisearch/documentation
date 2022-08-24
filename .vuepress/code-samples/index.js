const path = require('path')
const renderSamples = require('./render')
const { fetchRemoteSamples, fetchLocalSample } = require('./fetch')

module.exports = (options, context) => {
  return {
    async ready() {
      // To try the code-sample generation in local mode, please comment out the if condition but leave its content.
      }
    },
    name: 'fetch-sample-files',
    define() {
      // To try the code-sample generation in local mode, please comment out the whole if condition.
      const samples = require('./generated-samples.json')
      return {
        CODE_SAMPLES: renderSamples(samples),
      }
    },
    enhanceAppFiles: [path.resolve(__dirname, './client.js')],
  }
}
