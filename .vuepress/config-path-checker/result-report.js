const chalk = require('chalk')
const fs = require('fs')
const configFile = fs.readFileSync('./.vuepress/config.js', 'utf-8').split('\n')

function createReportResult({ type, msgFn }) {
  return {
    type,
    list: [],
    get msg() {
      return msgFn(this)
    },
  }
}

function displayReport(result, options) {
  const errorLevels = []
  const LOG_LEVELS = {
    none: 0,
    info: 1,
    warn: 2,
    error: 3,
  }

  /**
   * @param {ReportResult} obj
   */
  function convertErrMsg(obj) {
    return (
      `\n${
        obj.type === 'error'
          ? chalk.red(obj.msg)
          : obj.type === 'warn'
          ? chalk.yellow(obj.msg)
          : obj.msg
      }\n\n` +
      obj.list
        .map(
          (item) =>
            `  ${chalk.red(item.errMsg)}: ${item.fullText} ${chalk.gray(
              `(${item.fileUrl}:${item.line}:${item.column})`
            )}`
        )
        .join('\n') +
      '\n'
    )
  }

  Object.keys(result).forEach((k) => {
    /** @type {ReportResult} */
    const item = result[k]
    if (!item.list.length) {
      return
    }

    const level = LOG_LEVELS[item.type]
    errorLevels.push(level)
    if (level > LOG_LEVELS.none) {
      console[item.type](convertErrMsg(item))
    }
  })

  // should not exit if exitLevel is none
  const exitLevel = LOG_LEVELS[options.exitLevel.toLowerCase()]
  if (
    exitLevel !== LOG_LEVELS.none &&
    errorLevels.find((level) => level >= exitLevel)
  ) {
    console.error(chalk.red('Checking failed\n'))
    process.exit(1)
  } else {
    console.info(chalk.green('Checking passed\n'))
  }
}

function getLineAndColumn(path) {
  const found = configFile.reduce((acc, curr, index) => {
    // regex to match word path and its associated path on the same line
    const regex = new RegExp('path.*' + path + '[^/].*', 'g')
    const found = curr.match(regex)
    if (!(found == null)) {
      return [...acc, { line: curr, index }]
    }
    return acc
  }, [])
  // I will only take the first matched path to reduce complexity of code
  return {
    line: found[0].index,
    column: found[0].line.indexOf(path),
  }
}

function addError({ path, errMsg, fileUrl, fullText }) {
  const { line, column } = getLineAndColumn(path)

  this.error.list.push({
    type: 'error',
    errMsg,
    fileUrl,
    fullText,
    line,
    column,
  })
}

module.exports = {
  createReportResult,
  displayReport,
  getLineAndColumn,
  addError,
}
