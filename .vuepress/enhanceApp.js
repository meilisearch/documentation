export default ({
  router,
}) => {
  router.addRoutes([
    { path: '/errors', redirect: '/guides' },
    { path: '/errors/*', redirect: '/guides' },
  ])
}
