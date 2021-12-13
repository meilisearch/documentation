# Chapter 2: Customizing relevancy

## Ranking rules

- What kind of example goes here?

Relevancy refers to the accuracy and effectiveness of search results. If search results are almost always appropriate, then they can be considered relevant, and vice versa. MeiliSearch has a number of features for fine-tuning the relevancy of search results. The most important tool among them is ranking rules.

MeiliSearch sorts search responses based on a set of consecutive rules called ranking rules. These rules are stored in an array of strings called `rankingRules`. You can update these ranking rules for each index. The default order for the ranking rules is as follows:

1. Words
2. Typo
3. Proximity
4. Attribute
5. Sort
6. Exactness

The order in which ranking rules are applied matters. The first rule in the array has the most impact, and the last rule has the least.

You can read more about ranking rules in our [dedicated guide](/learn/core_concepts/relevancy.md).

-> How do we go from ranking rules to explaining all these different attributes. Need some introduction or something

- Do we have any order for these attributes? Or do we go with alphabetical order?

## Displayed attributes

- Do we need the json responses here as well? or is the interface enough?

By default, all attributes are displayed in each matching document but you can update the settings to change that. If you access the MeiliSearch web interface at `http://127.0.0.1:7700/`, you will notice that you can view all of the attributes in the `movies` index.

![Web interface with default displayed attributes](/getting-started/default_displayed_attributes.png)

If you only want to view the `title`, `poster`, and `overview`, you can do so with the following query:

<CodeSamples id= "getting_started_update_displayedAttributes_md" />

![Web interface with updated displayed attributes](/getting-started/updated_displayed_attributes.png)  

## distinctAttribute

- no idea what the example should be

MeiliSearch lets you set one field per index as the distinct attribute. The distinct attribute will always be unique among returned documents. This means there will never be more than one occurrence of the same value in the distinct attribute field among the returned documents.

## Searchable attributes

By default, all attributes are searched for matching query words but you can configure the settings to change that.

Let's look at MeiliSearch's web interface for this example. When we search for `2012` with the default settings, MeiliSearch searches for it everywhere.

![default searchableAttributes](/getting-started/default_searchableAttributes.gif)

If you update the `searchableAttributes` to only contain `title`, MeiliSearch will only consider `title` during search. You will see fewer results.

![title as the only searchableAttribute](/getting-started/title_searchableAttributes.gif)

Please note that **MeiliSearch will still highlight matches in other attributes, but they won’t be used to compute results.**

-> Moving from the different attributes to stop words and synonyms? Not sure if this is the right order

## stop words and synonyms

- Is it a good idea to link one-way association or should it be the Synonyms page? This link does take the user to the synonyms page so it shouldn't be a problem
- Do I need to include examples? I don't think so. The Synonyms and Stop words pages are pretty brief, too much info here will make them useless. But is this detail enough for demonstration purposes? Maybe add a gif and update the examples I used in the text accordingly?
- Not sure if gifs is a good idea for stop words. Any suggestions?

MeiliSearch allows you to create a list of words that is ignored in your search queries. These words are called stop words. A good example is the word `the` in English.

If you search the `movies` index for `the cat` with the default settings, MeiliSearch will return a lot of results but not all of them will be relevant. After adding `the` to your list of stop words, MeiliSearch will ignore all documents containing `the` and return the ones with `cat` improving the speed and relevancy of your search.

You can read more about stop words in our [dedicated guide](/reference/features/stop_words.md).

A list of synonyms is useful if you have multiple words with the same meaning in your dataset. This will make your search results more relevant. So if you have `winnie` and `piglet` set as synonyms, searching for either words will show the same results.

-> Need to create a gif

The only exception is one-way association, you can read more about it in our [dedicated guide](/reference/features/synonyms.md#one-way-association).
