# Migration documentation WIP

This document describes the expected/known behavior of the new documentation site.

Updates and major changes come in quickly and are not always immediately communicated, so it is possible descriptions and instructions are out of date.

## Repository structure

The docs repository no longer contains any code, only `.mdx` files for content and a few configuration JSON files.

### Site structure

Files can be stored in any structure. User-facing URLs and permalinks are determined manually via the `json` files inside the `/config` directory.

### Navigation and menus

It is possible to configure three menus directly from the docs repo: the sidebar menus for the `Learn` and `API reference` sections, and the footer menu at the bottom of the sidebars.

Each menu has its own config file. The config file should follow this pattern:

```json
[
  {
    "title": "Section",
    "slug": "section_name",
    "routes": [
    // Each route is an object corresponding to a page
      {
        "source": "sidebar_name/section_name/file.mdx",
        "label": "Page title",
        "slug": "file"
      }
    ]
  }
]
```

#### `/config/sidebar-learn.json`

Configures the `Learn` section in the left sidebar menu.

#### `/config/sidebar-reference.json`

Configures the `Reference` section in the left sidebar menu.

#### `/config/sidebar-footer.json`

Configures links at the bottom of the lefthand sidebar menu (e.g. `FAQ`, `Back to meilisearch.com`).

Not to be confused with the big site footer, which cannot be changed from the docs repo.

## Code samples

Work as in the previous site version.

To add new code samples:

1. Create an `id` (e.g. `new_codesample_1`)
2. Add a curl code sample to `/.code-samples.meilisearch.yaml`
3. Add `id` to `./sample-template.yaml`
4. Notify the integrations team we need them to create new samples for each SDK based on our curl example

## Static assets (images/datasets)

The build process does not currently support static assets with relative paths. Images and sample datasets must be linked via an external service. 

At the moment we're adding hard absolute links to the files on github:

```markdown
\!\[Image description\]\(https://raw.githubusercontent.com/meilisearch/documentation/[branch_name]/assets/images/[guide_name]/diagram.png\)
```

## Scraper

There's a GitHub action set up to trigger the scraping using a Vercel webhook. Will be migrated by basement into the repo before release.

## Tests and linting

- broken links checker: disabled, will be complex to implement
- vale: disabled, struggles with `.mdx` files
- markdown lint: disabled, must be replaced with `eslint` and `eslint-plugin-mdx`

## Components

### `<Featured items=[{}] />`

Displays items in a grid. Items must be given in an array of objects.

Objects can have the following fields:

- `icon`
- `content`
- `size`
- `link`

#### Usage

`<Featured>` should be standalone and not enclose regular markdown/HTML content:

```jsx
<Featured items=[{…}] />
```

#### `icon`

Default: `null` (no icon)

List of currently accepted `icon` strings:

- `cube`
- `letter`
- `circle`
- `compass`
- `globe`
- `user`

[Basement has created other all icons](https://drive.google.com/drive/folders/10Fvz6d6jPBhXYGhqFRR2G5GQQK43Nt2O), but these are not available for use in the website.

#### `size`

Default: `1`

`size` accepts an integer from `1` to `4`. The bigger the number, the wider the featured item, with `4` spanning the whole content column.

#### `content`

Default: `null` (no content)

Accepts any string value. Strings are not parsed as markdown. Any formatting must be done with HTML tags.

#### `link`

Default: `null`

Accepts a URL, either relative or absolute. If `link` is specified, the link will wrap the whole featured item.

### `<Capsule intent="string"></Capsule>`

Creates a callout box. Colour depends on `intent`.

Accepted `intent` values:

- `note` (default) (purple)
- `warning` (red)
- `danger` (yellow)
- `tip` (blue)

#### Usage

`<Capsule>` should be used to wrap content:

```jsx
// Correct
<Capsule intent="tip">
  ## Heading

  Paragraph content.
</Capsule>
```

## MDX basics

MDX is a mix of markdown and React components. All markdown files are valid MDX. All MDX is valid markdown, but content within React components will not display as expected.

### Components

React components are similar to HTML tags, but start with a capital letter: `<Featured>`.

Components can contain HTML elements, other components, and markdown:

```jsx
<Component>
  ## Heading

  <code>const foo = bat</code>

  <ReactButton />
</Component>
```

### Props

Components can be configured with props: `<Component propName="propValue" />`. **Prop strings cannot contain markdown.**

This will **not** work:

```jsx
<Component propName="_italics_" />
```
