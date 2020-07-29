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

async function testPresenceOfSamples(samples) {
  const rawTemplate = fs.readFileSync(`${process.cwd()}/.vuepress/public/sample-template.yaml`, 'utf-8')
  const template = sampleYamlToJs(rawTemplate, { label: 'template', url: 'local' })
  const templateIds = Object.keys(template).map(key => key)
  samples.map(sdk => {
    const samplesId = Object.keys(sdk.samples).map(key => key)
    const missingInSamples = templateIds.filter(x => !samplesId.includes(x))
    if (missingInSamples.length > 0) {
      log(`Some templates are missing in the ${sdk.label} lib:
    ${missingInSamples.join('\n    ')}\n`, 'FF0000')
    }
  })
}

async function fetchRemoteSamples() {
  log('Fetching remote sample files...')
  const samples = (await requestSamples()).filter((sample) => sample)
  samplesToFiles(samples)
  testPresenceOfSamples(samples)
  log(`File created with the following SDK's samples:
    ${samples.map((sample) => sample.label).join('\n    ')}\n`)
}

module.exports = {
  fetchRemoteSamples,
  fetchLocalSample,
}
