const chalk = require('chalk')
const path = require('path')
const { displayReport, createReportResult } = require('./result-report')
const { isObject } = require('./utils')
const { findChilds } = require('./find-and-check')

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
        return `${r.list.length} missing trailing html extension`
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
          'Checks for trailing html extension in vuepress paths with childs'
        )
        .action(() => {
          const sidebar = config.themeConfig.sidebar
          // Output information to distinguish with check-md
          log('Checking for missing trailing html extensions in parent\'s path...')
          if (isObject(sidebar)) {
            Object.keys(sidebar).map((key) => {
              findChilds.call(result, sidebar[key])
            })
          }
          displayReport(result, options)
        })
    },
  }
}
