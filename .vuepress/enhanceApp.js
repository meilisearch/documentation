export default ({
  router,
}) => {
  router.addRoutes([
    {
      path: '/error/:error',
      redirect: '/errors/',
    },
    {
      path: '/error/',
      redirect: '/errors/',
    },
  ])
}
