const { isObject } = require('./utils')
const { addError } = require('./result-report')
const path = require('path')

function checkPath(givenPath, elem) {
  if (givenPath.slice(-1) !== '/') {
    const origin = (elem && elem.title) ? `section ${elem.title}` : 'config.json'
    addError.call(this, {
      type: 'error',
      errMsg: `In ${origin} the path is missing a trailing slash`,
      fileUrl: path.join(process.cwd(), '/.vuepress/config.json'),
      fullText: `path: '${givenPath}'`,
      path: givenPath,
    })
  }
}

function searchForPath(element) {
  if (isObject(element)) {
    if (element.path && element.children) {
      checkPath.call(this, element.path, element)
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
