const ogprefix = 'og: http://ogp.me/ns#'
module.exports = {
  title: 'MeiliSearch Documentation v0.11',
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
      { text: 'Guides', link: '/guides/' },
      { text: 'API References', link: '/references/' },
      { text: 'Resources', link: '/resources/' },
      { text: 'FAQ', link: '/faq/faq.md' },
      { text: 'Slack', link: 'https://slack.meilisearch.com' },
    ],
    sidebar: {
      '/guides/': [
        {
          title: '🚀 Introduction',
          path: '/guides/introduction/',
          collapsable: false,
          children: [
            '/guides/introduction/quick_start_guide',
            '/guides/introduction/whats_next',
          ],
        },
        {
          title: '💡 Main concepts',
          path: '/guides/main_concepts/',
          collapsable: false,
          children: [
            '/guides/main_concepts/indexes',
            '/guides/main_concepts/documents',
            '/guides/main_concepts/search',
            '/guides/main_concepts/relevancy',
          ],
        },
        {
          title: '📚 Advanced Guides',
          path: '/guides/advanced_guides/',
          collapsable: false,
          children: [
            '/guides/advanced_guides/installation',
            '/guides/advanced_guides/search_parameters',
            '/guides/advanced_guides/filtering',
            '/guides/advanced_guides/faceted_search',
            '/guides/advanced_guides/authentication',
            '/guides/advanced_guides/asynchronous_updates',
            '/guides/advanced_guides/web_interface',
            '/guides/advanced_guides/datatypes',
            '/guides/advanced_guides/settings',
            '/guides/advanced_guides/synonyms',
            '/guides/advanced_guides/stop_words',
            '/guides/advanced_guides/distinct',
            '/guides/advanced_guides/field_properties',
            '/guides/advanced_guides/typotolerance',
            '/guides/advanced_guides/prefix',
            '/guides/advanced_guides/concat',
            '/guides/advanced_guides/bucket_sort',
          ],
        },
      ],
      '/references/': [
        {
          title: '📒 API References',
          path: '/references/',
          collapsable: false,
          children: [
            '/references/indexes',
            '/references/documents',
            '/references/search',
            '/references/updates',
            '/references/keys',
            {
              title: 'Settings',
              path: '/references/settings/',
              collapsable: false,
              children: [
                {
                  title: 'All Settings',
                  path: '/references/settings',
                },
                '/references/synonyms',
                '/references/stop_words',
                '/references/ranking_rules',
                '/references/distinct_attribute',
                '/references/searchable_attributes',
                '/references/displayed_attributes',
                '/references/accept_new_fields',
              ],
            },
            '/references/stats',
            '/references/health',
            '/references/version',
            '/references/sys-info',
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
          ],
        },
      ],
    },
  },
  plugins: [
    ['check-md', { pattern: '**/*.md', strictExt: true }],
    ['sitemap', { hostname: 'https://docs.meilisearch.com' }],
    ['seo', {}],
    'vuepress-plugin-element-tabs',
    ['vuepress-plugin-container', { type: 'note' }],
    [require('./config-path-checker')],
    [require('./custom-markdown-rules')],
    [require('./code-samples')],
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
    `,
    ],
  ],
}
