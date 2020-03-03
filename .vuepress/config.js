module.exports = {
  title: "MeiliSearch Documentation",
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
          title: "🚀 Introduction",
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
            "/guides/main_concepts/search"
          ]
        },
        {
          title: "📚 Advanced Guides",
          path: "/guides/advanced_guides/",
          collapsable: false,
          children: [
            "/guides/advanced_guides/binary",
            "/guides/advanced_guides/typotolerance",
            "/guides/advanced_guides/concat",
            "/guides/advanced_guides/ranking",
            "/guides/advanced_guides/synonyms",
            "/guides/advanced_guides/stop_words",
            "/guides/advanced_guides/search_parameters",
            "/guides/advanced_guides/keys",
            "/guides/advanced_guides/prefix",
            "/guides/advanced_guides/distinct",
            "/guides/advanced_guides/asynchronous_updates",
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
      ],
      '/tutorials/': [
        {
          title: '🍳 Cookbooks',
          path: '/tutorials/cookbooks/',
          collapsable: false
        },
        {
          title: '🧷 How to\'s',
          path: '/tutorials/howtos/',
          collapsable: false,
          children: [
            "/tutorials/howtos/quickstart"
          ]
        }
      ],
      '/resources/': [
        {
          title: "📦 Resources",
          path: '/resources/',
          collapsable: false,
          children: [
            "/resources/sdks",
            "/resources/comparison_to_alternatives"
          ]
        }
      ]
    },
    meilisearch: {
      hostUrl: 'https://e10b17e6.getmeili.com',
      indexUid: '9tz3lqoi',
      apiKey: 'R62XWZPJG794YB5VFOADHTNQEKLCISM01U38',
    },
    searchPlaceholder: 'Search as you type...'
  },
  plugins: [
    ["check-md", { pattern: "**/*.md" }],
    ["sitemap", { hostname: "https://docs.meilisearch.com" }],
    ["seo", {}],
    "vuepress-plugin-element-tabs",
    ['vuepress-plugin-container', { type: 'note' }]
  ],
  head: [
    ["meta", { charset: "utf-8" }],
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1" }],
    ["meta", {
      hid: "google-site-verification",
      name: "google-site-verification",
      content: "u0OYrst4u5F16t0Vh4-EkO_sWE38Pp9aT7idfr0Ar9c"
    }],
    ["meta", { hid: "og-title", name: "og:title", content: "MeiliSearch" }],
    ["meta", { hid: "og-type", name: "og:type", content: "website" }],
    ["meta", { hid: "og-url", name: "og:url", content: "http://meilisearch.com" }],
    ["meta", {
      hid: "og-image",
      name: "og:image",
      content:
        "https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb.png"
    }],
    ["meta", {
      hid: "og-image-secure-url",
      name: "og:image:secure_url",
      content:
        "https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb.png"
    }],
    ["meta", {
      hid: "og-image-image-type",
      name: "og:image:type",
      content: "image/png"
    }],
    ["meta", { hid: "og-image-height", name: "og:image:height", content: "630" }],
    ["meta", { hid: "og-locale", name: "og:locale", content: "en_GB" }],
    ["meta", { hid: "og-site-name", name: "og:site_name", content: "MeiliSearch" }],
    ["meta", { hid: "twitter-title", name: "twitter:title", content: "MeiliSearch" }],
    ["meta", {
      hid: "twitter-description",
      name: "twitter:description",
      content:
        "An open source, blazingly fast and hyper relevant search-engine that will improve your search experience"
    }],
    ["meta", {
      hid: "twitter-image",
      name: "twitter:image",
      content:
        "https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb.png"
    }],
    ["meta", {
      hid: "twitter-card",
      name: "twitter:card",
      content: "summary_large_image"
    }],
    ["meta", {
      hid: "twitter-image-alt",
      name: "twitter:image:alt",
      content: "Next generation search API"
    }],
    ["meta", { hid: "twitter-site", name: "twitter:site", content: "@meilisearch" }],
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
