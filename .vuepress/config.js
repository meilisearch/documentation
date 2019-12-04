module.exports = {
  title: "MeiliSearch Documentation",
  description: "Open source Instant Search Engine",
  themeConfig: {
    repo: "meilisearch/MeiliSearch",
    docsRepo: "meilisearch/documentation",
    editLinks: true,
    lastUpdated: "Last Updated",
    logo: "/logo.png",
    sidebar: [
      {
        title: "🚀 Getting started",
        path: "/",
        collapsable: false,
        sidebarDepth: 0,
        children: [
          "/getting_started/foreword",
          "/getting_started/quickstart",
          "/getting_started/features",
          "/getting_started/download"
        ]
      },
      {
        title: "💡 Main concepts",
        path: "/main_concepts/",
        collapsable: false,
        sidebarDepth: 1,
        children: [
          "/main_concepts/indexes",
          "/main_concepts/documents",
          "/main_concepts/search"
        ]
      },
      {
        title: "📚 Advanced Guides",
        path: "/advanced_guides/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          "/advanced_guides/binary",
          "/advanced_guides/typotolerance",
          "/advanced_guides/concat",
          "/advanced_guides/ranking",
          "/advanced_guides/synonyms",
          "/advanced_guides/stop_words",
          "/advanced_guides/search_parameters",
          "/advanced_guides/keys",
          "/advanced_guides/prefix",
          "/advanced_guides/distinct",
          "/advanced_guides/asynchronous_updates",
          "/advanced_guides/bucket_sort"
        ]
      },
      {
        title: "📒 API References",
        path: "/references/",
        collapsable: true,
        sidebarDepth: 1,
        children: [
          "/references/indexes",
          "/references/documents",
          "/references/search",
          "/references/synonyms",
          "/references/stop_words",
          "/references/updates",
          "/references/keys",
          "/references/settings",
          "/references/stats",
          "/references/health",
          "/references/version",
          "/references/sys-info"
        ]
      }
    ]
  },
  plugins: [
    ["check-md", { pattern: "**/*.md" }],
    ["sitemap", { hostname: "https://docs.meilisearch.com" }],
    ["seo", {}],
    "vuepress-plugin-element-tabs"
  ],
  head: [
    [
      "script",
      {},
      `
      window.$crisp=[];
      window.CRISP_WEBSITE_ID="38a71dd2-729c-4970-b061-3e1db1c1eb20";
      (function() {
          var d=document;
          var s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";
          s.async=1;
          d.getElementsByTagName("head")[0].appendChild(s);
      })();
    `
    ],
    [
      "script",
      {},
      `
    (function(f, a, t, h, o, m){
      a[h]=a[h]||function(){
        (a[h].q=a[h].q||[]).push(arguments)
      };
      o=f.createElement('script'),
      m=f.getElementsByTagName('script')[0];
      o.async=1; o.src=t; o.id='fathom-script';
      m.parentNode.insertBefore(o,m)
    })(document, window, '//analytics.meilisearch.com/tracker.js', 'fathom');
    fathom('set', 'siteId', 'XQNHD');
    fathom('trackPageview');
    `
    ]
  ]
};
