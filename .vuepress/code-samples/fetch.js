const sdks = require('./sdks.json')
const bent = require('bent')
const { log, samplesToFiles, sampleYamlToJs } = require('./fetch-utils')
const fs = require('fs')

/*
 * Fetches only cURL samples from local directory
 */
function readLocalSample() {
  const cURLPath = `${process.cwd()}/.code-samples.meilisearch.yaml`
  const curlSamples = fs.readFileSync(cURLPath, 'utf-8')
  return [
    {
      samples: sampleYamlToJs(curlSamples, {
        url: cURLPath,
        label: 'cURL',
      }),
      language: 'bash',
      label: 'cURL',
    },
  ]
}

function fetchLocalSample(options, ctx) {
  log('Fetching local file...')
  const sample = readLocalSample()
  log('Fetched local cURL file.')
  samplesToFiles(sample)
  log('Json sample file created.')
}

/**
 * Fetches all yaml file based on a list of SDK repositories URL's
 */
async function requestSamples() {
  const fetchPromises = sdks.map(async (sdk) => {
    try {
      const body = await bent(sdk.url, 'GET', 'string')()
      return {
        samples: sampleYamlToJs(body, sdk),
        language: sdk.language,
        label: sdk.label,
      }
    } catch (e) {
      // Crashes are not thrown. File will be ignored and warning raised
      log(
        `Warning: the sample file could not be fetched
        SDK: ${sdk.label},
        url: ${sdk.url}

        ${e.stack}`,
        '#FF0000'
      )
    }
  })
  return await Promise.all(fetchPromises)
}

async function fetchRemoteSamples(options, ctx) {
  if (ctx.isProd) {
    log('Fetching remote sample files...')
    const samples = (await requestSamples()).filter((sample) => sample)
    log('Fetched sample files of')
    samplesToFiles(samples)
    log(`File created with the following SDK's samples: 
    ${samples.map((sample) => sample.label).join('\n    ')}\n`)
  }
}

module.exports = {
  fetchRemoteSamples,
  fetchLocalSample,
}
