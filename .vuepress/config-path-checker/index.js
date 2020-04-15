const chalk = require('chalk')
const path = require('path')
const { displayReport, createReportResult } = require('./result-report')
const { isObject } = require('./utils')
const { checkPath, SearchForChilds } = require('./find-and-check')

const defaultOptions = {
  exitLevel: 'warn',
}

const log = (msg, color = 'blue', label = 'CONFIG-PATH-CHECKER') =>
  console.log(`\n${chalk.reset.inverse.bold[color](` ${label} `)} ${msg}`)

module.exports = (opt = {}) => {
  const relatifConfigPath = path.relative(__dirname, './.vuepress/config.js')
  const config = require(relatifConfigPath)
  const options = { ...defaultOptions, ...opt }
  const result = {
    warning: createReportResult({
      msgFn(r) {
        return `${r.list.length} warning was found`
      },
      type: 'warn',
    }),
    error: createReportResult({
      msgFn(r) {
        return `${r.list.length} missing trailing slash`
      },
      type: 'error',
    }),
  }

  return {
    name: 'check-config-paths',
    extendCli(cli) {
      cli
        .command(
          'check-config-paths',
          'Checks for trailing slash in vuepress paths'
        )
        .action(() => {
          const sidebar = config.themeConfig.sidebar
          // Output information to distinguish with check-md
          log('Checking for missing trailing slashes...')
          if (isObject(sidebar)) {
            Object.keys(sidebar).map((key) => {
              checkPath.call(result, key)
              SearchForChilds.call(result, sidebar[key])
            })
          }
          displayReport(result, options)
        })
    },
  }
}
