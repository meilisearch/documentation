module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
      "standard",
      'plugin:vue/recommended',
      "plugin:prettier/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "parser": "babel-eslint",
        "allowImportExportEverywhere": true,
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "prettier"
    ],
    "rules": {
      "vue/no-v-html":"off", //used in cases where HTML is needed
      "prettier/prettier": "error",
      'vue/max-attributes-per-line': [2, {
        'singleline': 20,
        'multiline': {
           'max': 1,
           'allowFirstLine': false
         }
      }]
    }
};
