const ogprefix = 'og: http://ogp.me/ns#'
module.exports = {
  title: 'MeiliSearch Documentation v0.20',
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
          sidebarDepth: 0,
          children: [
            '/learn/what_is_meilisearch/features',
            '/learn/what_is_meilisearch/philosophy',
            '/learn/what_is_meilisearch/sdks',
            '/learn/what_is_meilisearch/comparison_to_alternatives',
            '/learn/what_is_meilisearch/contact',
          ],
        },
        {
          title: '🚀 Getting Started',
          path: '/learn/getting_started/',
          collapsable: false,
          children: [
            '/learn/getting_started/installation',
            '/learn/getting_started/quick_start',
            '/learn/getting_started/whats_next',
          ],
        },
        {
          title: '💡 Core Concepts',
          path: '/learn/core_concepts/',
          collapsable: false,
          children: [
            '/learn/core_concepts/documents',
            '/learn/core_concepts/indexes',
            '/learn/core_concepts/relevancy',
          ],
        },
        {
          title: '📚 Advanced Topics',
          path: '/learn/advanced/',
          collapsable: false,
          children: [
            '/learn/advanced/asynchronous_updates',
            '/learn/advanced/snapshots_vs_dumps',
          ],
        },
      ],
      '/reference/': [
        {
          title: '⭐ Feature References',
          path: '/reference/features/',
          collapsable: true,
          children: [
            '/reference/features/authentication',
            '/reference/features/configuration',
            '/reference/features/distinct',
            '/reference/features/dumps',
            {
              title: 'Errors',
              path: '/errors/',
            },
            '/reference/features/faceted_search',
            '/reference/features/field_properties',
            '/reference/features/filtering',
            '/reference/features/known_limitations',
            '/reference/features/language',
            '/reference/features/search_parameters',
            '/reference/features/settings',
            '/reference/features/snapshots',
            '/reference/features/stop_words',
            '/reference/features/synonyms',
            '/reference/features/web_interface',
          ],
        },
        {
          title: '📒 API References',
          path: '/reference/api/',
          collapsable: true,
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
          title: '📇 OpenAPI',
          path: '/reference/open-api/',
        },
        {
          title: '🛠️ Under the Hood',
          path: '/reference/under_the_hood/',
          collapsable: true,
          children: [
            '/reference/under_the_hood/bucket_sort',
            '/reference/under_the_hood/concat',
            '/reference/under_the_hood/datatypes',
            '/reference/under_the_hood/prefix',
            '/reference/under_the_hood/storage',
            '/reference/under_the_hood/tokenization',
            '/reference/under_the_hood/typotolerance',
          ],
        },
      ],
      '/create/': [
        {
          title: '📜 How To',
          path: '/create/how_to/',
          collapsable: false,
          children: [
            {
              title: 'Basics',
              collapsable: false,
              sidebarDepth: 0,
              children: [
                {
                  title: 'Update MeiliSearch',
                  path: '/create/how_to/updating',
                },
                {
                  title: 'Run in Production',
                  path: '/create/how_to/running_production',
                },
                {
                  title: 'Use with Postman',
                  path: '/create/how_to/postman_collection',
                },
              ],
            },
            {
              title: 'Deploy',
              collapsable: false,
              sidebarDepth: 0,
              children: [
                {
                  title: 'Deploy on AWS',
                  path: '/create/how_to/aws',
                },
                {
                  title: 'Deploy on GCP',
                  path: '/create/how_to/gcp',
                },
                {
                  title: 'Deploy on DigitalOcean',
                  path: '/create/how_to/digitalocean_droplet',
                },
                {
                  title: 'Deploy on Qovery',
                  path: '/create/how_to/qovery',
                },
              ],
            },
            {
              title: 'Integrate',
              collapsable: false,
              sidebarDepth: 0,
              children: [
                {
                  title: 'Add a Search Bar to Your Docs',
                  path: '/create/how_to/search_bar_for_docs',
                },
                {
                  title: 'Add to a React app',
                  path: '/create/how_to/meilisearch_react',
                },
              ],
            },
            {
              title: 'Miscellaneous',
              collapsable: false,
              sidebarDepth: 0,
              children: [
                {
                  title: 'Use HTTP/2 and SSL',
                  path: '/create/how_to/http2_ssl',
                },
              ],
            },
          ],
        },
        {
          title: '❓ FAQ',
          path: '/create/faq',
          collapsable: false,
        },
      ],
    },
  },
  plugins: [
    ['check-md', { pattern: '**/*.md', strictExt: true, ignorePattern: ['errors', 'document_structure'] }],
    ['sitemap', { hostname: 'https://docs.meilisearch.com' }],
    ['seo', {}],
    'img-lazy',
    'vuepress-plugin-element-tabs',
    ['vuepress-plugin-container', { type: 'note' }],
    [require('./config-path-checker')],
    [require('./custom-markdown-rules')],
    [require('./custom-timestamp')],
    [require('./code-samples')],
    [require('./error-pages')],
    ['vuepress-plugin-code-copy', {
      color: '#3385ff',
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
    ['vuepress-plugin-zooming',
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
  ],
}
