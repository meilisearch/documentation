const ogprefix = 'og: http://ogp.me/ns#'
module.exports = {
  title: 'MeiliSearch Documentation v0.18',
  description: 'Open source Instant Search Engine',
  themeConfig: {
    repo: 'meilisearch/MeiliSearch',
    docsRepo: 'meilisearch/documentation',
    editLinks: true,
    lastUpdated: 'Last Updated',
    logo: '/logo.png',
    sidebarDepth: 1,
    smoothScroll: true,
    nav: [
      { text: 'Learn', link: '/learn/' },
      { text: 'Create', link: '/create/' },
      { text: 'Reference', link: '/reference/' },
      { text: 'Slack', link: 'https://slack.meilisearch.com' },
    ],
    sidebar: {
      '/learn/': [
        {
          title: '🔎 What Is MeiliSearch?',
          path: '/learn/what_is_meilisearch/',
          collapsable: false,
          children: [
            '/learn/what_is_meilisearch/sdks',
            '/learn/what_is_meilisearch/comparison_to_alternatives',
            '/learn/what_is_meilisearch/contact',
          ],
        },
        {
          title: '🚀 Learn MeiliSearch',
          path: '/learn/learn_meilisearch/',
          collapsable: false,
          children: [
            '/learn/learn_meilisearch/getting_started',
            '/learn/learn_meilisearch/whats_next',
          ],
        },
        {
          title: '💡 Core Concepts',
          path: '/learn/core_concepts/',
          collapsable: false,
          children: [
            '/learn/core_concepts/indexes',
            '/learn/core_concepts/documents',
            '/learn/core_concepts/search',
            '/learn/core_concepts/relevancy',
          ],
        },
        {
          title: '📚 Elevate Your Understanding',
          path: '/learn/elevate/',
          collapsable: false,
          children: [
            '/learn/elevate/faq',
          ],
        },
      ],
      '/reference/': [
        {
          title: '⭐ Feature References',
          path: '/reference/features/',
          collapsable: false,
          children: [
            '/reference/features/authentication',
            '/reference/features/configuration',
            '/reference/features/distinct',
            '/reference/features/faceted_search',
            '/reference/features/field_properties',
            '/reference/features/filtering',
            '/reference/features/installation',
            '/reference/features/known_limitations',
            '/reference/features/search_parameters',
            '/reference/features/settings',
            '/reference/features/snapshots_and_dumps',
            '/reference/features/synonyms',
            '/reference/features/tokenization',
            '/reference/features/web_interface',
          ],
        },
        {
          title: '📒 API References',
          path: '/reference/api/',
          collapsable: false,
          children: [
            '/reference/api/indexes',
            '/reference/api/documents',
            '/reference/api/search',
            '/reference/api/updates',
            '/reference/api/keys',
            {
              title: 'Settings',
              path: '/reference/api/settings/',
              collapsable: false,
              children: [
                {
                  title: 'All Settings',
                  path: '/reference/api/settings',
                },
                '/reference/api/synonyms',
                '/reference/api/stop_words',
                '/reference/api/ranking_rules',
                '/reference/api/attributes_for_faceting',
                '/reference/api/distinct_attribute',
                '/reference/api/searchable_attributes',
                '/reference/api/displayed_attributes',
              ],
            },
            '/reference/api/stats',
            '/reference/api/health',
            '/reference/api/version',
            '/reference/api/dump',
          ],
        },
        {
          title: '🛠️ Under the Hood 🔬',
          path: '/reference/under_the_hood',
          collapsable: false,
          children: [
            '/reference/under_the_hood/about_storage',
            '/reference/under_the_hood/asynchronous_updates',
            '/reference/under_the_hood/bucket_sort',
            '/reference/under_the_hood/concat',
            '/reference/under_the_hood/datatypes',
            '/reference/under_the_hood/prefix',
            '/reference/under_the_hood/stop_words',
            '/reference/under_the_hood/typotolerance',
          ],
        },
      ],
      '/resources/': [
        {
          title: '📦 Resources',
          path: '/resources/',
          collapsable: false,
          children: [
            '/resources/about_storage',
            '/resources/sdks',
            '/resources/comparison_to_alternatives',
            '/resources/postman_collection',
            '/resources/contact',
          ],
        },
        {
          title: '🏆 Tutorials',
          path: '/resources/tutorials/',
          collapsable: false,
          children: ['/resources/tutorials/running_production'],
        },
        {
          title: "🧷 How to's",
          path: '/resources/howtos/',
          collapsable: false,
          children: [
            '/resources/howtos/meilisearch_react',
            '/resources/howtos/digitalocean_droplet',
            '/resources/howtos/search_bar_for_docs',
            '/resources/howtos/http2_ssl',
          ],
        },
      ],
    },
  },
  plugins: [
    ['check-md', { pattern: '**/*.md', strictExt: true, ignorePattern: 'document_structure' }],
    ['sitemap', { hostname: 'https://docs.meilisearch.com' }],
    ['seo', {}],
    'img-lazy',
    'vuepress-plugin-element-tabs',
    ['vuepress-plugin-container', { type: 'note' }],
    [require('./config-path-checker')],
    [require('./custom-markdown-rules')],
    [require('./code-samples')],
    [require('./error-pages')],
    ['vuepress-plugin-code-copy', {
      color: '#3eaf7c',
      staticIcon: true,
    }],
    [
      'meilisearch',
      {
        hostUrl: 'https://docs-search-bar.meilisearch.com',
        apiKey:
          'd79226ae89f29d4dadba8d0c30c240e435f584fb83a7ae573b13eb62edec35cd',
        indexUid: 'docs',
        placeholder: 'Search as you type...',
      },
    ],
  ],
  head: [
    ['meta', { charset: 'utf-8' }],
    [
      'meta',
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    [
      'meta',
      {
        property: 'google-site-verification',
        content: 'u0OYrst4u5F16t0Vh4-EkO_sWE38Pp9aT7idfr0Ar9c',
      },
    ],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:title',
        content: 'MeiliSearch Documentation',
      },
    ],
    ['meta', { prefix: ogprefix, property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:url',
        content: 'http://docs.meilisearch.com',
      },
    ],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:image',
        content:
          'https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb.png',
      },
    ],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:image-secure-url',
        content:
          'https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb.png',
      },
    ],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:image-image-type',
        content: 'image/png',
      },
    ],
    ['meta', { prefix: ogprefix, property: 'og:image-height', content: '630' }],
    ['meta', { prefix: ogprefix, property: 'og:locale', content: 'en_GB' }],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:site-name',
        content: 'MeiliSearch Documentation',
      },
    ],
    [
      'meta',
      { property: 'twitter:title', content: 'MeiliSearch Documentation' },
    ],
    [
      'meta',
      {
        property: 'twitter:description',
        content: 'The official documentation of MeiliSearch',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:image',
        content:
          'https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb.png',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:image:alt',
        content: 'Next generation search API',
      },
    ],
    ['meta', { property: 'twitter:site', content: '@meilisearch' }],
    [
      'script',
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
    `,
    ],
    [
      'script',
      {},
      `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:2013731,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `,
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        spa: 'auto',
        site: 'WIMXMDAA',
        defer: true,
      },
    ],
  ],
}
