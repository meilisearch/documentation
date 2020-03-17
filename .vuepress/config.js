module.exports = {
  title: "MeiliSearch Documentation v0.9",
  description: "Open source Instant Search Engine",
  themeConfig: {
    repo: "meilisearch/MeiliSearch",
    docsRepo: "meilisearch/documentation",
    editLinks: true,
    lastUpdated: "Last Updated",
    logo: "/logo.png",
    sidebarDepth: 1,
    smoothScroll: true,
    nav: [
      { text: 'Guides', link: '/guides/' },
      { text: 'API References', link: '/references/' },
      { text: 'Tutorials', link: '/tutorials/' },
      { text: 'Resources', link: '/resources/' }
    ],
    sidebar: {
      '/guides/': [
        {
          title: "🚀 Getting started",
          path: '/guides/getting_started/',
          collapsable: false,
          children: [
            "/guides/getting_started/quick_start_guide",
            "/guides/getting_started/whats_next"
          ]
        },
        {
          title: "💡 Main concepts",
          path: "/guides/main_concepts/",
          collapsable: false,
          children: [
            "/guides/main_concepts/indexes",
            "/guides/main_concepts/documents",
            "/guides/main_concepts/search",
            "/guides/main_concepts/relevancy"
          ]
        },
        {
          title: "📚 Advanced Guides",
          path: "/guides/advanced_guides/",
          collapsable: false,
          children: [
            "/guides/advanced_guides/installation",
            "/guides/advanced_guides/search_parameters",
            "/guides/advanced_guides/keys",
            "/guides/advanced_guides/asynchronous_updates",
            "/guides/advanced_guides/web_interface",
            "/guides/advanced_guides/synonyms",
            "/guides/advanced_guides/stop_words",
            "/guides/advanced_guides/prefix",
            "/guides/advanced_guides/typotolerance",
            "/guides/advanced_guides/concat",
            "/guides/advanced_guides/distinct",
            "/guides/advanced_guides/bucket_sort"
          ]
        }
      ],
      '/download/': [
        {
          title: "Download",
          path:'/download/'
        }
      ],
      '/references/': [
        {
          title: '📒 API References',
          path: '/references/',
          collapsable: false,
          children: [
            "/references/indexes",
            "/references/documents",
            "/references/search",
            "/references/updates",
            "/references/keys",
            {
              title: 'Settings',
              path: '/references/settings',
              collapsable: false,
              children: [
                {
                  title: 'All Settings',
                  path: '/references/settings'
                },
                "/references/synonyms",
                "/references/stop_words",
                "/references/ranking_rules",
                "/references/distinct_attribute",
                "/references/searchable_attributes",
                "/references/displayed_attributes",
                "/references/accept_new_fields",
              ]
            },
            "/references/stats",
            "/references/health",
            "/references/version",
            "/references/sys-info"
          ]
        }
      ],
      '/tutorials/': [
        {
          title: '🚀 Quick Start',
          path: '/tutorials/quickstart/'
        },
        {
          title: '🍳 Cookbooks',
          path: '/tutorials/cookbooks/'
        },
        {
          title: '🧷 How to\'s',
          path: '/tutorials/howtos/'
        }
      ],
      '/resources/': [
        {
          title: "📦 Resources",
          path: '/resources/',
          collapsable: false,
          children: [
            "/resources/sdks"
          ]
        }
      ]
    },
  },
  plugins: [
    ["check-md", { pattern: "**/*.md" }],
    ["sitemap", { hostname: "https://docs.meilisearch.com" }],
    ["seo", {}],
    "vuepress-plugin-element-tabs",
    ['vuepress-plugin-container', { type: 'note' }],
    ['vue-directive-tooltip']
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
