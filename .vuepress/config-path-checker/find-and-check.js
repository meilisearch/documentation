const { isObject } = require('./utils')
const { addError } = require('./result-report')
const path = require('path')

// Check if the path validates the predicates
function checkPathValidity(parentPath, elem) {
  // Check for a trailing html extension
  if (parentPath.slice(-5) !== '.html') {
    const origin = (elem && elem.title) ? `section ${elem.title}` : 'config.json'
    addError.call(this, {
      type: 'error',
      errMsg: `In ${origin} the path is missing the trailing html extension`,
      fileUrl: path.join(process.cwd(), '/.vuepress/config.js'),
      fullText: `path: '${parentPath}'`,
      path: parentPath,
    })
  }
}

function findParentPath(element) {
  // If the element is not an object it cannot contain a `path` key
  if (isObject(element)) {
    // Will only check the path of the current element if it has childs.
    if (element.path && element.children) {
      checkPathValidity.call(this, element.path, element)
    }
    if (element.children) {
      findChilds.call(this, element.children)
    }
  }
}

// Crawl inside elements to find childs
function findChilds(element) {
  if (Array.isArray(element)) {
    element.map((child) => findParentPath.call(this, child))
  } else if (isObject(element)) {
    findParentPath.call(this, element)
  }
}

module.exports = {
  checkPathValidity,
  findParentPath,
  findChilds,
}
