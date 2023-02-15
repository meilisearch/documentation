const sdks = require('./sdks.json')
const bent = require('bent')
const { log, logInFile, samplesToFiles, sampleYamlToJs, initLogFile } = require('./fetch-utils')
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
        cacheableTab: sdk.cacheableTab,
        ignoreInSamplesReport: sdk.ignoreInSamplesReport,
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

async function testPresenceOfSamples(languageSamples) {
  const rawTemplate = fs.readFileSync(`${process.cwd()}/.vuepress/public/sample-template.yaml`, 'utf-8')
  const template = sampleYamlToJs(rawTemplate, { label: 'template', url: 'local' })
  const allSampleIds = Object.keys(template)

  let titles = '| Sample ids |'
  let tableStructure = '| -- |'
  const lines = []

  const relevantLanguageSamples = languageSamples.filter(sdk => !sdk.ignoreInSamplesReport)
  relevantLanguageSamples.map(sdk => {
    titles = titles += `${sdk.label} |`
    tableStructure += '--|'
  })

  allSampleIds.map((sampleId) => {
    let line = `| \`${sampleId}\` |`

    relevantLanguageSamples.map(sdk => {
      if (Object.keys(sdk.samples).includes(sampleId)) {
        line += '✅ |'
      } else {
        line += '❌ |'
      }
    })
    lines.push(line)
  })

  logInFile('\n')
  logInFile(titles)
  logInFile(tableStructure)
  logInFile(lines.join('\n'))
}

async function fetchRemoteSamples() {
  initLogFile()
  log('Fetching remote sample files...')
  const samples = (await requestSamples()).filter((sample) => sample)
  samplesToFiles(samples)
  testPresenceOfSamples(samples)
}

module.exports = {
  fetchRemoteSamples,
  fetchLocalSample,
}
