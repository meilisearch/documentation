const yamlToJs = require('js-yaml')
const fs = require('fs')

/*
 * Convert YAML string to Js object
 * Throw a precise error on parsing fail.
 */
function sampleYamlToJs(content) {
  try {
    return yamlToJs.safeLoad(content)
  } catch (e) {
    throw new Error(`Error file could not be parsed in JSON
    ${e.message}

    ${e.stack}`)
  }
}

module.exports = {
  async additionalPages() {
    const errorYaml = fs.readFileSync(`${process.cwd()}/errors.yaml`, 'utf-8')
    console.log(errorYaml)
    const errors = sampleYamlToJs(errorYaml).errors
    const errorsPages = []
    errorsPages.push({
      path: '/errors-list/', // Cannot be errors. Works in development mode but not production
      content: `## MeiliSearch Errors \n ${errors.map(err => `* [${err.code}](/errors/${err.code})\n`).join('')}`,
    })
    errors.map(err => {
      errorsPages.push({
        path: `/errors/${err.code}/`,
        content: `## ${err.code} \n ${err.description}`,
      })
    })
    return errorsPages
  },
}
