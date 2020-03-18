# MeiliSearch documentation

## Requirements

- Yarn

## Installation

```bash
$ git clone git@github.com:meilisearch/documentation.git
$ cd documentation
$ yarn
```

## Launch

### Development
```bash
$ yarn dev
```

### Testing
```bash
$ yarn check-links
```
This test will check all links in the documentation. If some dead links are found the tests will fail.


## Changing the documentation

Directory structure can be changed in `.vuepress/config.js`. Every file needs to be added manually to the config file in the right parent directory.

