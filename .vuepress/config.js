module.exports = {
  title: 'Meili Documentation',
  description: 'The Meili incredible documentation',
  head: [
    ['script', {}, `
      window.$crisp=[];
      window.CRISP_WEBSITE_ID="38a71dd2-729c-4970-b061-3e1db1c1eb20";
      (function() {
          var d=document;
          var s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";
          s.async=1;
          d.getElementsByTagName("head")[0].appendChild(s);
      })();
    `]
  ],
  themeConfig: {
    sidebar: [
      '/',
      '/indexes',
      '/documents',
      '/search',
    ]
  }
}
