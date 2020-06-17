<template>
  <form
    id="search-form"
    class="meilisearch-search-wrapper search-box"
    role="search"
  >
    <input
      id="meilisearch-search-input"
      class="search-query"
      :placeholder="placeholder"
    >
  </form>
</template>

<script>
export default {
  name: 'MeiliSearchBox',
  data() {
    return {
      placeholder: undefined,
    }
  },
  watch: {
    options(newValue) {
      this.update(newValue)
    },
  },
  mounted() {
    const options = {
      hostUrl: HOST_URL,
      apiKey: API_KEY,
      indexUid: INDEX_UID,
      meilisearchOptions: {
        limit: MAX_SUGGESTIONS || this.$site.themeConfig.searchMaxSuggestions || 5,
        cropLength: CROP_LENGTH,
      },
      autocompleteOptions: {
        keyboardShortcuts: HOT_KEYS,
      },
    }
    this.initialize(options)
    this.placeholder = PLACEHOLDER || this.$site.themeConfig.searchPlaceholder || ''
  },

  methods: {
    initialize(userOptions) {
      Promise.all([
        import(
          /* webpackChunkName: "docs-searchbar" */ 'docs-searchbar.js/dist/cdn/docs-searchbar.min.js'
        ),
        import(
          /* webpackChunkName: "docs-searchbar" */ 'docs-searchbar.js/dist/cdn/docs-searchbar.min.css'
        ),
      ]).then(([docsSearchBar]) => {
        docsSearchBar = docsSearchBar.default
        const input = Object.assign({}, userOptions, {
          inputSelector: '#meilisearch-search-input',
          handleSelected: (input, event, suggestion) => {
            const { hostname, pathname, hash } = new URL(suggestion.url)
            if (hostname === 'github.com') {
              window.open(suggestion.url, '_blank')
            } else {
              const routepath = pathname.replace(this.$site.base, '/')
              this.$router.push(`${routepath}${hash}`)
            }
          },
        })
        docsSearchBar(input)
      })
    },

    update(options) {
      this.$el.innerHTML =
        '<input id="meilisearch-search-input" class="search-query">'
      this.initialize(options)
    },
  },
}
</script>

<style lang="stylus">
.search-box
  display inline-block
  position relative
  margin-right 1rem
  input
    cursor text
    width 10rem
    height: 2rem
    color lighten($textColor, 25%)
    display inline-block
    border 1px solid darken($borderColor, 10%)
    border-radius 2rem
    font-size 0.9rem
    line-height 2rem
    padding 0 0.5rem 0 2rem
    outline none
    transition all .2s ease
    &:focus
      cursor auto
      border-color $accentColor
    background #fff url(../../../node_modules/vuepress-plugin-meilisearch/assets/search.svg) 0.6rem 0.5rem no-repeat
    background-size 1rem

.meilisearch-search-wrapper
  & > span
    vertical-align middle
  .meilisearch-autocomplete
    line-height 2
    .docs-searchbar-suggestion--highlight
      color darken($accentColor, 20%)
    .docs-searchbar-suggestion
      border-color $borderColor
      .docs-searchbar-suggestion--category-header
        background #f1f3f5
        padding 5px 10px
        border-radius 4px
        background lighten($accentColor, 20%)
        font-weight 600
        color #fff
        .docs-searchbar-suggestion--highlight
          background rgba(255, 255, 255, 0.6)
          box-shadow none
      .docs-searchbar-suggestion--wrapper
        padding 0
      .docs-searchbar-suggestion--title
        margin-bottom 0
        color $textColor
      .docs-searchbar-suggestion--subcategory-column
        border-color $borderColor
      .docs-searchbar-suggestion--subcategory-column-text
        color #555
      .docs-searchbar-suggestion--text
        .docs-searchbar-suggestion--highlight
          box-shadow inset 0 -2px 0 0 lighten($accentColor, 20%)
    .docs-searchbar-footer
      display flex !important
      justify-content space-between !important
      align-items center !important
      .docs-searchbar-footer-logo
        margin-bottom -4px
    .dsb-cursor .docs-searchbar-suggestion--content
      background-color #e7edf3 !important
      color $textColor

@media (min-width: $MQMobile)
  .meilisearch-search-wrapper
    .meilisearch-autocomplete
      .docs-searchbar-suggestion
        .docs-searchbar-suggestion--subcategory-column
          float none
          width 150px
          min-width 150px
          display table-cell
        .docs-searchbar-suggestion--content
          float none
          display table-cell
          width 100%
          vertical-align top
        .dsb-dropdown-menu
          min-width 515px !important

@media (max-width: $MQMobile)
  .meilisearch-search-wrapper
    .dsb-dropdown-menu
      min-width calc(100vw - 4rem) !important
      max-width calc(100vw - 4rem) !important
    .docs-searchbar-suggestion--wrapper
      padding 5px 7px 5px 5px !important
    .docs-searchbar-suggestion--subcategory-column
      padding 0 !important
      background white !important
    .docs-searchbar-suggestion--subcategory-column-text:after
      content " > "
      font-size 10px
      line-height 14.4px
      display inline-block
      width 5px
      margin -3px 3px 0
      vertical-align middle
</style>
