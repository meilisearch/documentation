const chalk = require('chalk')
const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path')

/*
 * Convert YAML string to Js object
 * Throw a precise error on parsing fail.
 */
function sampleYamlToJs(body, sdk) {
  try {
    return yaml.safeLoad(body)
  } catch (e) {
    throw new Error(`The sample file of ${sdk.label} SDK cannot be converted to JSON
    SDK: ${sdk.label},
    url: ${sdk.url}

    ${e.stack}`)
  }
}

/*
 * Pretty console log function
 */
const log = (msg, color = 'FFB4E1', label = 'CODE-SAMPLE-FETCHER') => {
  console.log(`\n${chalk.reset.inverse.bold.hex(color)(` ${label} `)} ${msg}`)
}

const logInFile = (msg) => {
  fs.appendFileSync(
    path.join(__dirname, 'missing-samples-report.md'),
    msg + '\n'
  )
}

const initLogFile = () => {
  fs.writeFileSync(path.join(__dirname, 'missing-samples-report.md'), '# Code samples state\n')
}

/*
 * Writes file in JSON format
 */
function samplesToFiles(samples) {
  fs.writeFileSync(
    path.join(__dirname, 'generated-samples.json'),
    JSON.stringify(samples, null, 2)
  )
}

module.exports = {
  log,
  logInFile,
  samplesToFiles,
  sampleYamlToJs,
  initLogFile,
}
