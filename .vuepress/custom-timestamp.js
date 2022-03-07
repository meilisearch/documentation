module.exports = {
  plugins: [
    [
      '@vuepress/last-updated', false,
      {
        transformer: (timestamp, lang) => {
          // Don't forget to install moment yourself
          const moment = require('moment')
          return moment(timestamp).format('L')
        },
      },
    ],
  ],
}
