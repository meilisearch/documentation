# Search

MeiliSearch has been designed to improve your search experience.

## Simple and Intuitive

For developers, it requires very little configuration to be up and running. Communication to the server is done through a [RESTful API](/references/README.md).

For users, the search experience aims to feel simple so they can focus on the results. MeiliSearch delivers an intuitive search-as-you-type experience; which means a response time lower than 50 milliseconds.

## Highly Customizable

MeiliSearch works out-of-the-box with default settings that meet the needs of most projects.

However, searching is highly customizable.

> It would not be a search engine if there wasn't a notion of relevancy in the results returned.

The returned results are **sorted according to a set of consecutive rules called [ranking rules](/guides/main_concepts/relevancy.md#ranking-rules)**. You can delete existing rules, add new ones, or even change the order in which they are executed.

You can also **configure the [search parameters](/guides/advanced_guides/search_parameters.md)** to refine your search even further.

## Features

![search demo gif](/search-synonyms-typo.gif)

> MeiliSearch in action with `batman` and `joker` being defined as synonyms.

All of MeiliSearch's features are provided out-of-the-box and can be easily configured.

### Search as you type

Also called instant search, results are displayed while you are still inputting your query. Showed results are changed in real-time whenever you type additional text in the search box.

### Typo tolerance

Instead of letting typos ruin your search experience, MeiliSearch will find the results you expect.

### Synonyms

Search should not be limited by some specific words.

### Languages support

MeiliSearch supports Latin-based languages, English, and Kanji characters.

### Highlighting

Search results contain highlighted queried terms to further enhance usability. Users don't need to read the entire text. The terms are highlighted and thus catch their eye.

There are more features to come such as... faceting!

## Give it a try!

We also deliver an **out-of-the-box web interface** in which you can test MeiliSearch interactively.

Follow [this guide](/guides/advanced_guides/web_interface.md) to give the search engine a try!
