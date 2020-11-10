const { isObject } = require('./utils')
const { addError } = require('./result-report')
const path = require('path')

function checkPath(givenPath) {
  if (givenPath.slice(-1) !== '/') {
    addError.call(this, {
      type: 'error',
      errMsg: 'Path in config.json file is missing a trailing slash',
      fileUrl: path.join(__dirname, 'config.json'),
      fullText: `path: '${path}'`,
      path: givenPath,
    })
  }
}

function searchForPath(element) {
  if (isObject(element)) {
    if (element.path && element.children) {
      checkPath.call(this, element.path)
    }
    if (element.children) {
      SearchForChilds.call(this, element.children)
    }
  }
}

function SearchForChilds(element) {
  if (Array.isArray(element)) {
    element.map((child) => searchForPath.call(this, child))
  } else if (isObject(element)) {
    searchForPath.call(this, element)
  }
}

module.exports = {
  checkPath,
  searchForPath,
  SearchForChilds,
}
