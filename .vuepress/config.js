const ogprefix = 'og: http://ogp.me/ns#'
module.exports = {
  title: 'Meilisearch Documentation v0.30',
  description: 'Open source Instant Search Engine',
  theme: 'default-prefers-color-scheme',
  themeConfig: {
    docsRepo: 'meilisearch/documentation',
    docsBranch: 'main',
    editLinks: true,
    logo: '/logo.svg',
    sidebarDepth: 1,
    smoothScroll: true,

    nav: [
      { text: 'Learn', link: '/learn/getting_started/quick_start' },
      { text: 'Reference', link: '/reference/api/overview' },
      { text: 'FAQ', link: '/faq' },
      {
        text: 'Integrations',
        items: [
          {
            text: 'SDKs',
            items: [
              { text: '.NET', link: 'https://github.com/meilisearch/meilisearch-dotnet' },
              { text: 'Dart', link: 'https://github.com/meilisearch/meilisearch-dart' },
              { text: 'Golang', link: 'https://github.com/meilisearch/meilisearch-go' },
              { text: 'Java', link: 'https://github.com/meilisearch/meilisearch-java' },
              { text: 'JavaScript', link: 'https://github.com/meilisearch/meilisearch-js' },
              { text: 'PHP', link: 'https://github.com/meilisearch/meilisearch-php' },
              { text: 'Python', link: 'https://github.com/meilisearch/meilisearch-python' },
              { text: 'Ruby', link: 'https://github.com/meilisearch/meilisearch-ruby' },
              { text: 'Rust', link: 'https://github.com/meilisearch/meilisearch-rust' },
              { text: 'Swift', link: 'https://github.com/meilisearch/meilisearch-swift' },
            ],
          },
          {
            text: 'Frameworks',
            items: [
              { text: 'Rails', link: 'https://github.com/meilisearch/meilisearch-rails' },
              { text: 'Laravel', link: 'https://github.com/laravel/scout' },
              { text: 'Symfony', link: 'https://github.com/meilisearch/meilisearch-symfony' },
            ],
          },
          {
            text: 'Front-end tools',
            items: [
              { text: 'instant-meilisearch', link: 'https://github.com/meilisearch/instant-meilisearch' },
              { text: 'docs-searchbar.js', link: 'https://github.com/meilisearch/docs-searchbar.js' },
            ],
          },
          {
            text: 'Plugins',
            items: [
              { text: 'Gatsby', link: 'https://github.com/meilisearch/gatsby-plugin-meilisearch/' },
              { text: 'Vuepress', link: 'https://github.com/meilisearch/vuepress-plugin-meilisearch' },
              { text: 'Strapi', link: 'https://github.com/meilisearch/strapi-plugin-meilisearch/' },
              { text: 'Firebase', link: 'https://github.com/meilisearch/firestore-meilisearch' },
            ],
          },
          {
            text: 'DevOps tools',
            items: [
              { text: 'Kubernetes', link: 'https://github.com/meilisearch/meilisearch-kubernetes' },
              { text: 'DigitalOcean', link: 'https://github.com/meilisearch/meilisearch-digitalocean' },
              { text: 'GCP', link: 'https://github.com/meilisearch/meilisearch-gcp' },
              { text: 'AWS', link: 'https://github.com/meilisearch/meilisearch-aws' },
            ],
          },
        ],
      },
      {
        text: 'More Meilisearch',
        items: [
          { text: 'GitHub', link: 'https://github.com/meilisearch/meilisearch' },
          { text: 'Discord', link: 'https://discord.gg/meilisearch' },
          { text: 'Blog', link: 'https://blog.meilisearch.com/' },
          { text: 'meilisearch.com', link: 'https://meilisearch.com' },
        ],
      },
    ],
    sidebar: {
      '/learn/': [
        {
          title: '🔎 What is Meilisearch?',
          path: '/learn/what_is_meilisearch/overview.html',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            {
              title: 'Overview',
              path: '/learn/what_is_meilisearch/overview',
            },
            '/learn/what_is_meilisearch/features',
            '/learn/what_is_meilisearch/philosophy',
            '/learn/what_is_meilisearch/sdks',
            '/learn/what_is_meilisearch/comparison_to_alternatives',
            '/learn/what_is_meilisearch/telemetry',
            '/learn/what_is_meilisearch/search_preview',
            '/learn/what_is_meilisearch/language',
            '/learn/what_is_meilisearch/contact',
          ],
        },
        {
          title: '🚀 Getting started',
          path: '/learn/getting_started/quick_start.html',
          collapsable: false,
          children: [
            '/learn/getting_started/quick_start',
            {
              title: 'Meilisearch 101',
              path: '/learn/getting_started/filtering_and_sorting.html',
              collapsable: false,
              children: [
                '/learn/getting_started/filtering_and_sorting',
                '/learn/getting_started/customizing_relevancy',
                '/learn/getting_started/getting_ready_for_production',
              ],
            },
            {
              title: 'Migrating from Algolia',
              path: '/learn/getting_started/algolia_migration',
            },
          ],
        },
        {
          title: '💡 Core concepts',
          path: '/learn/core_concepts/documents.html',
          collapsable: false,
          children: [
            '/learn/core_concepts/documents',
            '/learn/core_concepts/indexes',
            '/learn/core_concepts/relevancy',
            '/learn/core_concepts/primary_key',
          ],
        },
        {
          title: '⚙️ Configuration',
          collapsable: false,
          path: '/learn/configuration/instance_options.html',
          children: [
            {
              title: 'Configure Meilisearch at launch',
              path: '/learn/configuration/instance_options',
            },
            {
              title: 'Index settings',
              collapsable: false,
              path: '/learn/configuration/settings.html',
              children: [
                {
                  title: 'Overview',
                  path: '/learn/configuration/settings',
                },
                '/learn/configuration/distinct',
                '/learn/configuration/displayed_searchable_attributes',
                '/learn/configuration/synonyms',
                '/learn/configuration/typo_tolerance',
              ],
            },
          ],
        },
        {
          title: '🔐 Security and permissions',
          collapsable: false,
          path: '/learn/security/master_api_keys.html',
          children: [
            '/learn/security/master_api_keys',
            '/learn/security/tenant_tokens',
          ],
        },
        {
          title: '📚 Advanced topics',
          path: '/learn/advanced/asynchronous_operations.html',
          collapsable: false,
          children: [
            '/learn/advanced/asynchronous_operations',
            '/learn/advanced/filtering_and_faceted_search',
            '/learn/advanced/geosearch',
            '/learn/advanced/pagination',
            '/learn/advanced/sorting',
            '/learn/advanced/working_with_dates',
            {
              title: 'Updating Meilisearch',
              path: '/learn/advanced/updating',
            },
            {
              title: 'Data backup',
              collapsable: false,
              children: [
                {
                  title: 'Snapshots vs dumps',
                  path: '/learn/advanced/snapshots_vs_dumps',
                },
                {
                  title: 'Dumps',
                  path: '/learn/advanced/dumps',
                },
                {
                  title: 'Snapshots',
                  path: '/learn/advanced/snapshots',
                },
              ],
            },
            {
              title: 'Inner workings',
              collapsable: false,
              children: [
                '/learn/advanced/concat',
                '/learn/advanced/datatypes',
                '/learn/advanced/indexing',
                '/learn/advanced/known_limitations',
                '/learn/advanced/prefix',
                '/learn/advanced/storage',
                '/learn/advanced/tokenization',
              ],
            },
          ],
        },
        {
          title: '📕 Cookbooks',
          path: '/learn/cookbooks/running_production.html',
          collapsable: false,
          children: [
            {
              title: 'Run in production',
              path: '/learn/cookbooks/running_production',
            },
            {
              title: 'Use with Postman',
              path: '/learn/cookbooks/postman_collection',
            },
            {
              title: 'Use with Docker',
              path: '/learn/cookbooks/docker',
            },
            {
              title: 'Add a search bar to your docs',
              path: '/learn/cookbooks/search_bar_for_docs',
            },
            {
              title: 'Set up HTTP/2 and SSL',
              path: '/learn/cookbooks/http2_ssl',
            },
            {
              title: 'Deployment',
              collapsable: false,
              sidebarDepth: 0,
              children: [
                {
                  title: 'Deploy on AWS',
                  path: '/learn/cookbooks/aws',
                },
                {
                  title: 'Deploy on Azure',
                  path: '/learn/cookbooks/azure',
                },
                {
                  title: 'Deploy on GCP',
                  path: '/learn/cookbooks/gcp',
                },
                {
                  title: 'Deploy on DigitalOcean',
                  path: '/learn/cookbooks/digitalocean_droplet',
                },
                {
                  title: 'Deploy on Railway',
                  path: '/learn/cookbooks/railway',
                },
                {
                  title: 'Deploy on Koyeb',
                  path: '/learn/cookbooks/koyeb',
                },
                {
                  title: 'Deploy on Qovery',
                  path: '/learn/cookbooks/qovery',
                },
              ],
            },
          ],
        },
        {
          title: '👐 Contributing',
          path: '/learn/contributing/overview.html',
          collapsable: false,
          children: [
            {
              title: 'Overview',
              path: '/learn/contributing/overview',
            },
            {
              title: 'Contributing to the docs',
              path: '/learn/contributing/contributing_to_docs',
            },
          ],
        },
      ],
      '/reference/': [
        {
          title: '📒 API reference',
          path: '/reference/api/overview.html',
          collapsable: false,
          children: [
            {
              title: 'Overview',
              path: '/reference/api/overview',
            },
            '/reference/api/indexes',
            '/reference/api/documents',
            '/reference/api/search',
            '/reference/api/tasks',
            '/reference/api/keys',
            '/reference/api/settings',
            '/reference/api/stats',
            '/reference/api/health',
            '/reference/api/version',
            '/reference/api/dump',
          ],
        },
        {
          title: '❌ Errors',
          path: '/reference/errors/overview.html',
          collapsable: false,
          children: [
            {
              title: 'Status codes and Meilisearch errors',
              path: '/reference/errors/overview',
            },
            {
              title: 'Error codes',
              path: '/reference/errors/error_codes',
            },
          ],
        },
      ],
    },
  },
  plugins: [
    [
      'check-md',
      {
        pattern: '**/*.md',
        strictExt: true,
        ignoreFilePattern: ['document_structure'],
        ignoreHashPattern: ['actions-2', 'primary-key-2', 'query-parameters-2', 'query-parameters-3'],
        exitLevel: 'warn',
      },
    ],
    ['sitemap', { hostname: 'https://docs.meilisearch.com' }],
    ['seo', {}],
    'img-lazy',
    // Because colors can not be set through the settings of the plugin
    // Change are done in .vuepress/styles/palette.styl
    '@bidoubiwa/vuepress-plugin-element-tabs',
    ['vuepress-plugin-container', { type: 'note' }],
    [require('./config-path-checker')],
    [require('./custom-markdown-rules')],
    [require('./code-samples')],
    [
      'vuepress-plugin-code-copy',
      {
        color: '#FF5CAA',
        staticIcon: true,
      },
    ],
    [
      'meilisearch',
      {
        hostUrl: 'https://ms-5894428564fa-173.lon.meilisearch.io',
        apiKey:
          '06UKvqod16fff6018934c85a4d393534b1b96cd6c3a5ee492bcd4a4e720e26fb24ef1cbb',
        indexUid: 'docs',
        placeholder: 'Press \'s\' or \'/\' to search',
        enableDarkMode: 'auto', // Default: false
      },
    ],
    [
      'vuepress-plugin-zooming',
      {
        selector: '.theme-default-content img',
        delay: 1000,
        options: {
          bgColor: 'black',
          zIndex: 10000,
        },
      },
    ],
  ],
  head: [
    ['link', { rel: 'icon', href: '/favicon-32x32.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap' }],
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
        content: 'Meilisearch Documentation',
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
          'https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb_vmbpxo.png',
      },
    ],
    [
      'meta',
      {
        prefix: ogprefix,
        property: 'og:image-secure-url',
        content:
          'https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb_vmbpxo.png',
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
        content: 'Meilisearch Documentation',
      },
    ],
    [
      'meta',
      { property: 'twitter:title', content: 'Meilisearch Documentation' },
    ],
    [
      'meta',
      {
        property: 'twitter:description',
        content: 'The official documentation of Meilisearch',
      },
    ],
    [
      'meta',
      {
        property: 'twitter:image',
        content:
          'https://res.cloudinary.com/meilisearch/image/upload/v1582134509/og-image_dlbsnb_vmbpxo.png',
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
        src: 'https://thrilling-thirtyeight.meilisearch.com/script.js',
        spa: 'auto',
        site: 'QNBPJXIV',
        defer: true,
      },
    ],
    [
      'script',
      {},
      `
      !function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[]};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{r.invoked=!0;var n=t.createElement("script");n.type="text/javascript",n.integrity="sha384-GS6YJWyepBi+TL3uXx5i7xx1UTA9iHaZr9q+5uNsuhzMb8c1SfkKW4Wee/IxZOW5",n.crossOrigin="anonymous",n.async=!0,n.src="https://cdn.amplitude.com/libs/analytics-browser-1.0.0-min.js.gz",n.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var s=t.getElementsByTagName("script")[0];function v(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}}s.parentNode.insertBefore(n,s);for(var o=function(){return this._q=[],this},i=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],a=0;a<i.length;a++)v(o,i[a]);r.Identify=o;for(var u=function(){return this._q=[],this},c=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],l=0;l<c.length;l++)v(u,c[l]);r.Revenue=u;var p=["getDeviceId","setDeviceId","regenerateDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport"],d=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue"];function f(e){function t(t,r){e[t]=function(){var n={promise:new Promise((r=>{e._q.push({name:t,args:Array.prototype.slice.call(arguments,0),resolve:r})}))};if(r)return n}}for(var r=0;r<p.length;r++)t(p[r],!1);for(var n=0;n<d.length;n++)t(d[n],!0)}f(r),e.amplitude=r}}(window,document)}();

      amplitude.init("c823626ba80dd6aafb16601a74e0f603");
    `,
    ],
  ],
}
