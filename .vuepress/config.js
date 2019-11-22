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
    `],
    ['script', {}, `
      (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
      ;r.type="text/javascript"
      ;r.integrity="sha384-d/yhnowERvm+7eCU79T/bYjOiMmq4F11ElWYLmt0ktvYEVgqLDazh4+gW9CKMpYW"
      ;r.crossOrigin="anonymous";r.async=true
      ;r.src="https://cdn.amplitude.com/libs/amplitude-5.2.2-min.gz.js"
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
      ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId"]
      ;function v(e){function t(t){e[t]=function(){
      e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
      for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
      e=(!e||e.length===0?"$default_instance":e).toLowerCase()
      ;if(!n._iq.hasOwnProperty(e)){n._iq[e]={_q:[]};v(n._iq[e])}return n._iq[e]}
      ;e.amplitude=n})(window,document);

      amplitude.getInstance().init("b1e93a7d40b5ea629cf0abee212cb54c");
    `]
  ],
  themeConfig: {
    repo: 'meilisearch/MeiliDB',
    logo: '/logo.png',
    sidebar: [
      {
        title: 'Introduction',
        path:  '',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          '',
          '/introduction/quickstart',
          '/introduction/features'
        ]
      },
      {
        title: 'Main concepts',
        path:  '/main_concept/',
        collapsable: true,
        sidebarDepth: 1,
        children: [   
          '/main_concept/indexes',
          '/main_concept/documents',
          '/main_concept/search'
        ]
      },
      {
        title: 'Advanced Guide',
        path:  '/advanced_guides/typotolerance',
        collapsable: true,
        sidebarDepth: 1,
        children: [
          '/advanced_guides/typotolerance',
          '/advanced_guides/ranking',
          '/advanced_guides/synonyms',
          '/advanced_guides/stop_words',
          '/advanced_guides/search_parameters',
          '/advanced_guides/keys',
          '/advanced_guides/distinct',
          '/advanced_guides/updates',
          '/advanced_guides/bucket_sort'
        ]
      },
      {
        title: 'API References',
        path:  '/references/',
        collapsable: true,
        sidebarDepth: 1,
        children: [
          '/references/headers',
          '/references/indexes',
          '/references/documents',
          '/references/search',
          '/references/synonyms',
          '/references/stop_words',
          '/references/updates',
          '/references/keys',
          '/references/settings',
          '/references/stats',
          '/references/health',
          '/references/version',
          '/references/sys-info'
        ]
      },
    ]
  }
}
