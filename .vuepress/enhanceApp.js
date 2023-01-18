export default ({ router }) => {
  // Replaces the underscores (_) in the anchors on error_codes to hypens (-)
  // example:
  // before: /reference/errors/error_codes.html#dump_not_found
  // after: /reference/errors/error_codes.html#dump-not-found
  router.beforeEach((to, from, next) => {
    const { fullPath } = to

    // matches error_codes anchors that contains underscore instead of hypens
    const matches = fullPath.match(/\/reference\/errors\/error_codes\.html#([^-]+)$/)
    if (matches && matches[1]) {
      const underscoreAnchor = matches[1]
      const hypenAnchor = matches[1].replace(/_/g, '-')
      const newUrl = fullPath.replace(underscoreAnchor, hypenAnchor)

      // redirects to newUrl
      next({ path: newUrl })
    } else {
      next()
    }
  })
}
