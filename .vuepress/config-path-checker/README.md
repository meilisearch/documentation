# Config path checker

This local plugin checks inside the routing of `config.js` every chosen predicate.

These are the current predicates:

### Parent's paths must contains a trailing html extension

This predicate only applies to elements that do have childs.

For example:

```js
  {
    title: 'Settings',
    path: '/reference/api/settings.html', // Must contain an html extension
    collapsable: false,
    children: [
      {
        title: 'All Settings',
        path: '/reference/api/settings', // Should not contain an html extension
      },
      '/reference/api/displayed_attributes',
    ],
  }
```
