export default ({
  router,
}) => {
  router.addRoutes([
    { path: '/errors', redirect: '/' },
    { path: '/errors/*', redirect: '/' },
  ])
}
