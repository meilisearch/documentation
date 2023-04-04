# Migration documentation WIP

This document describes the expected/known behavior of the new documentation site.

Updates and major changes come in quickly and are not always immediately communicated, so it is possible descriptions and instructions are out of date.

## Repository structure

The docs repository no longer contains any code, only mdx files for content and a couple of JSON files for section menus.

Files can be stored in any structure. User-visible URLs and permalinks are determined manually via the `json` files inside the `/config` directory.

## Static assets (images/datasets)

The new website does not currently support static asset hosting.

Images and sample datasets must be linked via an external service. At the moment we're adding hard absolute links to the files on github.


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

```
<Component propName="_italics_" />
```

## Scraper

We do not yet know how it works. Differently from our current setup, it should run post-deploy and negate issues with slightly out-of-date search results.

## Tests and linting

Currently disabled. Must be heavily reworked before we can reactivate them.
