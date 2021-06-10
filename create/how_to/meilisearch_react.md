# Implement instant search in your React app in 5 minutes

_The following is a guest post by Riccardo Giorato._

![Decathlon front page](/react-guide/decatlon.png)

## Introduction

In this quick tutorial, you'll learn how to easily create a search page with instant and reliable results thanks to the power of **MeiliSearch**.

> MeiliSearch is an open source, high-relevancy search engine, built in [Rust](https://www.rust-lang.org/).

We will cover the basic steps to get the search running and move on to more advanced topics at the end.

For the example, let's recreate a fast and beautiful search experience for a Sport brand.

Here is a **video preview** of what you will be building:

<iframe width="560" height="315" src="https://www.youtube.com/embed/PA5LI1xldMA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Prerequisites

Before getting started, ensure that you have [Node](https://nodejs.org/en/) already installed on your machine.

You will create the boilerplate code for your React app using the custom project we created for you : [https://github.com/Giorat/meili_react_demo](https://github.com/Giorat/meili_react_demo)

Finally, this tutorial assumes that you are already familiar with [React](https://reactjs.org/docs/getting-started.html). If that is not the case, you can check the React Documentation to learn more.

## Getting started

### Clone the repository

```bash
git clone https://github.com/Giorat/meili_react_demo.git
cd meili_react_demo
```

### Run a new Docker image

If you cloned the repository, to set up the MeiliSearch instance just execute inside the main folder:

```bash
npm run setup_meili
```

If you didn't clone the repo and you want to create directly the Docker instance execute this command:

```bash
docker run -p 7700:7700 -v $(pwd)/data.ms:/data.ms getmeili/meilisearch
```

You will be able to check that MeiliSearch is running by visiting the following URL:

- [http://localhost:7700/](http://localhost:7700/)

## Create an index in MeiliSearch

An index is an entity in which documents are stored, like an array of objects with some specific settings attached to it and a unique primary key.

You can read more about the properties of [indexes](/learn/core_concepts/indexes.md) in the the MeiliSearch documentation.

In order to create your index, you need to find out what your primary key is. Below is a sample document to add to MeiliSearch.

```json
{
  "id": 100013768717,
  "name": "Fitness Foldable Shoe Bag",
  "url": "https://www.decathlon.com/products/gym-foldable-shoe-bag",
  "vendor": "Domyos",
  "category": "Sport bag",
  "tags": [
    "Artistic Gymnastics",
    "Boy's",
    "CARDIO_FITNESS_ACCESSORIES",
    "CARDIO_FITNESS_BAGS",
    "CODE_R3: 11782"
  ],
  "images": "https://cdn.shopify.com/s/files/1/1330/6287/products/sac_20a_20chaussure_20kaki_20_7C_20001_20_7C_20PSHOT_20_490180e6-44e4-4340-8e3d-c29eb70c6ac8.jpg?v=1584683232",
  "creation_date": "2020-04-03T15:58:48-07:00",
  "price": "2.49"
}
```

In this document, the field that holds the unique value of the document is the `id` field. This attribute is called the `primary key` in MeiliSearch.

You can easily create this Index with a Rest client like Postman but, in this tutorial, you will use the MeiliSearch Javascript SDK to do it directly from node.js.

```javascript
const MeiliSearch = require("meilisearch");

(async () => {
  try {
    const config = {
      host: 'http://127.0.0.1:7700'
    };

    const meili = new MeiliSearch(config);

    await meili.createIndex({ uid: "decathlon", primaryKey: "id" });

  } catch (e) {
    console.log("Meili error: ", e.message);
  }
})();
```

## Index documents

MeiliSearch receives documents in JSON format and stores them for searching purposes. These documents are composed of fields that can hold any type of data.

For this tutorial, you can download this dataset full of sportswear items:

- [decathlon.json](https://github.com/Giorat/meili_react_demo/blob/master/backend/decathlon.json)

To upload all the objects from this JSON file, use the following script:

```javascript
const MeiliSearch = require("meilisearch");

(async () => {
  try {
    const config = {
      host: 'http://127.0.0.1:7700'
    };

    const meili = new MeiliSearch(config);

    const decathlon = require("./decathlon.json"); // path to json file

    const index = await meili.getIndex("decathlon");

    await index.addDocuments(decathlon);

  } catch (e) {
    console.log("Meili error: ", e.message);
  }
})();
```

::: warning

Remember to change the path to your JSON file before running this script!

:::

## Prepare the React app

You will use a standard React App that you can create using CRA or simply by cloning this repository:

```bash
git clone https://github.com/Giorat/meili_react_demo.git
cd meili_react_demo
```

If you prefer to start from an empty app you can create your own using the following command. You can name the application however you desire.

```bash
npx create-react-app meili_react_demo
cd meili_react_demo
```

### Including Tailwind CSS

To speed up the styling process, add Tailwind CSS style directly to index.html:

```html
<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">
```

### Configure App.js state

Then, modify the App.js file using this code to set up a simple Search form and a few State variables to handle every aspect of the search.

```javascript
import React, { useState, useEffect } from "react";

// TODO configure the MeiliSearch Client

function App() {
  const [searchedWord, setSearch] = useState("dumbell");
  const [resultSearch, setResults] = useState([]);
  const [resultCards, setCards] = useState([]);

  // TODO add function to send searchedWord to MeiliSearch

  // TODO add function to parse the JSON object

  return (
    <div className="mx-auto">
      <div class="header font-sans text-white items-center justify-center">
        <header class="py-12">
          <img
            class="h-20 w-auto items-center justify-center p-2 mx-auto"
            src="/wide_logo.png"
            style={{ filter: "invert(0%)" }}
            alt=""
          />
          <h1 class="flex flex-wrap flex-grow text-3xl w-full justify-center p-4">
            Stop looking for an item — find it and work hard!
          </h1>
          <div class="border rounded overflow-hidden w-full flex justify-center mx-auto searchBox mt-6">
            <button class="flex items-center justify-center px-4 shadow-md bg-white text-black">
              <svg
                class="h-4 w-4 text-grey-dark"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
            </button>
            <input
              type="text"
              value={searchedWord}
              onChange={(event) => setSearch(event.target.value)}
              class="px-6 py-4 w-full text-black"
              placeholder="Product, sport, color, …"
            />
          </div>
        </header>
      </div>
      <div>
        <div class="flex flex-wrap searchResults">{resultCards}</div>
      </div>
    </div>
  );
}

export default App;
```

This code should output this beautiful header with a search form.

![Decathlon front page](/react-guide/decat_before.png)

## Search results in React

Connecting to MeiliSearch from React using the MeiliSearch Javascript SDK is a simple operation that can be done in just a few steps.

### MeiliSearch client

Install the MeiliSearch SDK:

:::: tabs

::: tab npm

```bash
# if you use npm
npm install meilisearch
```

:::
::: tab yarn

```bash
# if you use yarn
yarn add meilisearch
```

:::
::::

Set up the MeiliSearch Client with the server URL. In our case, it was the localhost Docker machine. Finally, load the right Index from the backend.

Replace this comment in App.js by the code snippet below:
`// TODO configure the MeiliSearch Client`

```javascript
import MeiliSearch from "meilisearch";

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700/",
});

const index = client.getIndex("decathlon");
```

### Send the search query

Use an `useEffect` to execute the search of the typed words into MeiliSearch. All the results hits will be set to a simple state variable called “resultsSearch”.

Replace this comment in App.js by the code snippet below:
`// TODO add function to send searchedWord to MeiliSearch`

```javascript
 useEffect(() => {
    // Create an scoped async function in the hook
    async function searchWithMeili() {
      const search = await index.search(searchedWord);
      setResults(search.hits);
    }
    // Execute the created function directly
    searchWithMeili();
  }, [searchedWord]);
```

### Showcase the results

Inside a second `useEffect`, you will search through the JSON objects returned by MeiliSearch. They will have the same structure than the uploaded JSON objects.

Then, it's time to create a list of cards linking to the products pages.

Replace this comment in App.js by the code snippet below:
`// TODO add function to parse the JSON object`

```javascript
useEffect(() => {
    let arrayItems = [];
    for (let i = 0; i < resultSearch.length; i++) {
      const product = resultSearch[i];
      arrayItems.push(
        <div class="flex w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-3">
          <a
            href={product.url}
            class="flex-1 rounded overflow-hidden shadow-lg"
          >
            <img
              class="w-full h-48 object-cover"
              src={product.images}
              alt={product.name}
              onError={(e)=>{e.target.onerror = null; e.target.src="/wide_logo.png"}}
            />
            <div class="px-6 py-3">
              <div class="font-bold text-sm mb-1 text-gray-600 capitalize">
                {product.category}
              </div>
              <div class="font-bold text-xl mb-2 text-gray-800">
                {product.vendor} - {product.name.substr(0, 20)}
              </div>
              <p class="text-black text-xl font-bold text-base py-2">
                $ {product.price}
              </p>
            </div>
          </a>
        </div>
      );
    }
    setCards(arrayItems);
  }, [resultSearch]);
```

You can have a look at the full [App.js](https://github.com/Giorat/meili_react_demo/blob/master/src/App.js) code here:

- [https://github.com/Giorat/meili_react_demo/blob/master/src/App.js](https://github.com/Giorat/meili_react_demo/blob/master/src/App.js)

You can visit the live application here: [https://meili-react-demo.netlify.app/](https://meili-react-demo.netlify.app/)

![Decathlon front page](/react-guide/decatlon.png)

## Configure the search even more!

With MeiliSearch, you get a ton of other small options you can fine-tune to improve your Search experience. For advanced exploration, you will need to do a few extra configuration steps.

### Search ranking

Start by changing the search rankings, or more simply, the way MeiliSearch looks through the documents you uploaded to find the references to your search terms inside the [rankingRules](/learn/core_concepts/relevancy.md#relevancy) object. In that case, set the following ranking:

- "typo"
- "words"
- "proximity"
- "attribute"
- "wordsPosition"
- "exactness"
- "desc(creation_date)"

This configuration is the default one except for the last field which is a custom rule "desc(creation_date)". The latter ranks items by their creation date if all previous values are identical.

### Searchable attributes

Secondly, you have to specify the attributes that MeiliSearch can search from in each document, inside a [searchableAttributes](/reference/features/field_properties.md#searchable-fields) object. Here, the configuration is done to search only on name, vendor, category and tags leaving out images or URL.

### Displayed attributes

Lastly, you have to specify the attributes that MeiliSearch can return to the user by the Frontend application with the [displayedAttributes](http://localhost:8080/guides/advanced_guides/field_properties.md#displayed-fields) object.

### Upload the new settings to MeiliSearch

```javascript
const MeiliSearch = require("meilisearch");

(async () => {
  try {
    const config = {
      host: 'http://127.0.0.1:7700'
    };

    const meili = new MeiliSearch(config);

    const index = await meili.getIndex("decathlon");

    const newSettings = {
      rankingRules: [
        "typo",
        "words",
        "proximity",
        "attribute",
        "wordsPosition",
        "exactness",
        "desc(creation_date)"
      ],
      searchableAttributes: ["name", "vendor", "category", "tags"],
      displayedAttributes: [
        "name",
        "vendor",
        "category",
        "tags",
        "images",
        "url"
      ]
    };

    await index.updateSettings(newSettings);

  } catch (e) {
    console.log("Meili error: ", e.message);
  }
})();
```

## Conclusion

This quick search wouldn’t be possible without an incredible team that is working on this great project night and day! If you might enjoy contributing to the MeiliSearch family you can jump on these repositories to bring some help, issues or tips and tricks:

- [https://github.com/meilisearch/MeiliSearch](https://github.com/meilisearch/MeiliSearch)
- [https://github.com/meilisearch/meilisearch-js](https://github.com/meilisearch/meilisearch-js)

General discussion is very welcome on the forum or chat:

- [https://github.com/meilisearch/MeiliSearch/discussions](https://github.com/meilisearch/MeiliSearch/discussions)
- [https://slack.meilisearch.com/](https://slack.meilisearch.com/)

And also don’t forget to leave a Star on the main project on [Github here](https://github.com/meilisearch/MeiliSearch).
