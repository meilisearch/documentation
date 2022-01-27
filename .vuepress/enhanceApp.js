export default ({
  router,
}) => {
  router.addRoutes([
    {
      path: '/learn/',
      redirect: '/learn/getting_started/quick_start',
    },
    {
      path: '/learn/getting_started/',
      redirect: '/learn/getting_started/quick_start',
    },
    {
      path: '/learn/core_concepts/',
      redirect: '/learn/core_concepts/documents',
    },
    {
      path: '/learn/advanced/',
      redirect: '/learn/advanced/asynchronous_operations',
    },
    {
      path: '/learn/cookbooks/',
      redirect: '/learn/cookbooks/running_production',
    },
    {
      path: '/learn/contributing/',
      redirect: '/learn/contributing/contributing_to_docs',
    },
    {
      path: '/reference/',
      redirect: '/reference/api/',
    },
    {
      path: '/reference/features/',
      redirect: '/reference/features/configuration',
    },
  ])
}
