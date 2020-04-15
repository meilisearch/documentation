module.exports = {
  isObject: function (element) {
    if (!Array.isArray(element) && element instanceof Object) {
      return true
    }
    return false
  },
}
