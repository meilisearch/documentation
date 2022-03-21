const ogprefix = 'og: http://ogp.me/ns#'
module.exports = {
  title: 'Meilisearch Documentation v0.26',
  description: 'Open source Instant Search Engine',
  theme: 'default-prefers-color-scheme',
  themeConfig: {
    repo: 'meilisearch/Meilisearch',
    docsRepo: 'meilisearch/documentation',
    editLinks: true,
    lastUpdated: 'Last Updated',
    logo: '/logo.svg',
    sidebarDepth: 1,
    smoothScroll: true,

    nav: [
      { text: 'Learn', link: '/learn/getting_started/quick_start' },
      { text: 'API Reference', link: '/reference/api/overview' },
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
            ],
          },
          {
            text: 'DevOp tools',
            items: [
              { text: 'Kubernetes', link: 'https://github.com/meilisearch/meilisearch-kubernetes' },
              { text: 'GCP', link: 'https://github.com/meilisearch/meilisearch-gcp' },
              { text: 'AWS', link: 'https://github.com/meilisearch/meilisearch-aws' },
            ],
          },
        ],
      },
      { text: 'Slack', link: 'https://slack.meilisearch.com' },
      { text: 'Blog', link: 'https://blog.meilisearch.com/' },
    ],
    sidebar: {
      '/learn/': [
        {
          title: '🔎 What is Meilisearch?',
          path: '/learn/what_is_meilisearch/overview/',
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
          path: '/learn/getting_started/quick_start/',
          collapsable: false,
          children: [
            '/learn/getting_started/quick_start',
            {
              title: 'MeiliSearch 101',
              path: '/learn/getting_started/filtering_and_sorting/',
              collapsable: false,
              children: [
                '/learn/getting_started/filtering_and_sorting',
                '/learn/getting_started/customizing_relevancy',
                '/learn/getting_started/getting_ready_for_production',
              ],
            },
          ],
        },
        {
          title: '💡 Core concepts',
          path: '/learn/core_concepts/documents/',
          collapsable: false,
          children: [
            '/learn/core_concepts/documents',
            '/learn/core_concepts/indexes',
            '/learn/core_concepts/relevancy',
          ],
        },
        {
          title: '⚙️ Configuration',
          collapsable: false,
          path: '/learn/configuration/instance_options/',
          children: [
            {
              title: 'Configure Meilisearch at launch',
              path: '/learn/configuration/instance_options',
            },
            {
              title: 'Index settings',
              collapsable: false,
              path: '/learn/configuration/settings/',
              children: [
                {
                  title: 'Overview',
                  path: '/learn/configuration/settings',
                },
                '/learn/configuration/distinct',
                '/learn/configuration/displayed_searchable_attributes',
                '/learn/configuration/synonyms',
              ],
            },
          ],
        },
        {
          title: '🔐 Security and permissions',
          collapsable: false,
          path: '/learn/security/master_api_keys/',
          children: [
            '/learn/security/master_api_keys',
            '/learn/security/tenant_tokens',
          ],
        },
        {
          title: '📚 Advanced topics',
          path: '/learn/advanced/asynchronous_operations/',
          collapsable: false,
          children: [
            '/learn/advanced/asynchronous_operations',
            '/learn/advanced/filtering_and_faceted_search',
            '/learn/advanced/geosearch',
            '/learn/advanced/sorting',
            {
              title: 'Updating Meilisearch',
              path: '/learn/advanced/updating.md',
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
                '/learn/advanced/indexation',
                '/learn/advanced/known_limitations',
                '/learn/advanced/prefix',
                '/learn/advanced/storage',
                '/learn/advanced/tokenization',
                '/learn/advanced/typotolerance',
              ],
            },
          ],
        },
        {
          title: '📕 Cookbooks',
          path: '/learn/cookbooks/running_production/',
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
                  title: 'Deploy on Qovery',
                  path: '/learn/cookbooks/qovery',
                },
              ],
            },
          ],
        },
        {
          title: '🧪 Experimental',
          collapsable: false,
          path: '/learn/experimental/overview/',
          children: [
            {
              title: 'Overview',
              path: '/learn/experimental/overview',
            },
            {
              title: 'Auto-batching',
              path: '/learn/experimental/auto-batching',
            },
          ],
        },
        {
          title: '👐 Contributing',
          path: '/learn/contributing/overview/',
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
          path: '/reference/api/overview/',
          collapsable: false,
          children: [
            {
              title: 'Overview',
              path: '/reference/api/overview',
            },
            '/reference/api/sample_ref',
            '/reference/api/indexes',
            '/reference/api/documents',
            '/reference/api/search',
            '/reference/api/tasks',
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
                '/reference/api/displayed_attributes',
                '/reference/api/distinct_attribute',
                '/reference/api/filterable_attributes',
                '/reference/api/ranking_rules',
                '/reference/api/searchable_attributes',
                '/reference/api/sortable_attributes',
                '/reference/api/stop_words',
                '/reference/api/synonyms',
              ],
            },
            '/reference/api/stats',
            '/reference/api/health',
            '/reference/api/version',
            '/reference/api/dump',
            '/reference/api/error_codes',
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
        ignoreFilePattern: ['errors', 'document_structure'],
        ignoreHashPattern: ['actions-2'],
        exitLevel: 'warn',
      },
    ],
    ['sitemap', { hostname: 'https://docs.meilisearch.com' }],
    ['seo', {}],
    'img-lazy',
    // Because colors can not be set through the settings of the plugin
    // Change are done in .vuepress/styles/palette.styl
    'vuepress-plugin-element-tabs',
    ['vuepress-plugin-container', { type: 'note' }],
    [require('./config-path-checker')],
    [require('./custom-markdown-rules')],
    [require('./custom-timestamp')],
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
        hostUrl: 'https://ms-480d6ad12249-173.saas.meili.dev',
        apiKey:
          'b587b006a5e827e320046fb036a15f219a14c3f05f21224c1fc7a9c00f4504ca',
        indexUid: 'docs',
        placeholder: 'Search as you type...',
        enableDarkMode: true, // Default: false
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
        src: 'https://cdn.usefathom.com/script.js',
        spa: 'auto',
        site: 'WIMXMDAA',
        defer: true,
      },
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
      (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
      ;r.type="text/javascript"
      ;r.integrity="sha384-girahbTbYZ9tT03PWWj0mEVgyxtZoyDF9KVZdL+R53PP5wCY0PiVUKq0jeRlMx9M"
      ;r.crossOrigin="anonymous";r.async=true
      ;r.src="https://cdn.amplitude.com/libs/amplitude-7.2.1-min.gz.js"
      ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
      console.log("[Amplitude] Error: could not load SDK")}}
      ;var i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)
      ;function s(e,t){e.prototype[t]=function(){
      this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
      var o=function(){this._q=[];return this}
      ;var a=["add","append","clearAll","prepend","set","setOnce","unset"]
      ;for(var u=0;u<a.length;u++){s(o,a[u])}n.Identify=o;var c=function(){this._q=[]
      ;return this}
      ;var l=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
      ;for(var p=0;p<l.length;p++){s(c,l[p])}n.Revenue=c
      ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId", "enableTracking", "setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
      ;function v(e){function t(t){e[t]=function(){
      e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
      for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
      e=(!e||e.length===0?"$default_instance":e).toLowerCase()
      ;if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
      ;e.amplitude=n})(window,document);

      amplitude.getInstance().init("b1e93a7d40b5ea629cf0abee212cb54c");
      amplitude.getInstance().logEvent('NEW_DOC_VISIT');
    `,
    ],
    [
      'script',
      {},
      `
      !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="jezyOXRIO1Azyxx0vCcH1afz4b4boYmp";analytics.SNIPPET_VERSION="4.13.2";
        analytics.load("jezyOXRIO1Azyxx0vCcH1afz4b4boYmp");
        analytics.page();
      }}();
    `,
    ],
  ],
}
