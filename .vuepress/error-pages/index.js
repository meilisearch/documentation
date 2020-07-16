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
      path: '/errors', // Cannot be errors. Works in development mode but not production
      content: `## MeiliSearch Errors
${errors.map(err => `
#### \`${err.code}\`
${err.description}
`).join('')}`,
    })
    return errorsPages
  },
}
