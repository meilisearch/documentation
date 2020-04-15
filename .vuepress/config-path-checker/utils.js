module.exports = {
  isArray: function (element) {
    if (Array.isArray(element)) return true
    return false
  },
  isObject: function (element) {
    if (!Array.isArray(element) && element instanceof Object) {
      return true
    }
    return false
  },
}
