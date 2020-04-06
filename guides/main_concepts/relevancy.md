# Relevancy

Search responses are sorted according to a set of consecutive rules called **ranking rules**. When a search query is made, MeiliSearch uses a [bucket sort](/guides/advanced_guides/bucket_sort.md) to rank documents. Each rule is applied to all documents that are considered equal according to the previous rule to break the tie.

Ranking rules are **built-in rules applied to the search results** in order to improve their relevancy. To benefit from the ranking rules and make them meet your dataset and needs, it is important to understand how each of them works and how to create new ones.

For a more in-depth explanation of the algorithm and the default ranking rules, [see this issue](https://github.com/meilisearch/MeiliSearch/issues/358).

## Ranking rules

Ranking rules determine which documents are returned upon a search query.

The order in which these rules are applied has a significant impact on the search results. The first rules being the most impactful and the last one the least. The default order has been chosen because it meet most standard needs. **This order can be changed in the settings**.

The ranking rules are **customizable** which means **existing rules can be deleted and new ones can be added.**

Each of the rules has a special use in finding the right documents for a given search query.
The order in which the rules are set affects their importance. They are arranged from the most impactful rule to the least impactful rule.

By default, ranking rules are executed in the following order:

#### 1. Typo

Results are sorted by **increasing number of typos**: find documents that match query terms with fewer typos first.

#### 2. Words

Results are sorted by **decreasing number of matched query terms** in each matching document: find documents that contain more occurrences of the query terms first.

::: warning

It is now mandatory that all query terms are present in the returned documents. This rule does not impact search results yet. <Badge text="soon" type="warn"/>

:::

#### 3. Proximity

Results are sorted by **increasing distance between matched query terms**: find documents that contain more query terms found close together (close proximity between two query terms) and appearing in the original order specified in the query string first.

#### 4. Attribute

Results are sorted according to **[the order of importance of the attributes](/guides/main_concepts/relevancy.md#importance-of-the-attributes)**: find documents that contain query terms in more important attributes first.

#### 5. Words Position

Results are sorted by **the position of the query words in the attributes**: find documents that contain query terms earlier in their attributes first.

#### 6. Exactness

Results are sorted by **the similarity of the matched words with the query words**: find documents that contain exactly the same terms as the ones queried first.

#### Examples

:::: tabs

::: tab Typo

![Image from alias](../../public/image/vogli3.png)

### Typo

- `vogli`: 0 typo
- `volli`: 1 typo

The `typo` rule sorts the results by increasing number of typos on matched query words.

:::

::: tab Proximity
![Image from alias](../../public/image/new_road.png)

### Proximity

The reason why `Creature` is listed before `Mississippi Grind` is because of the `proximity` rule.<br>
The smallest **distance** between the matching words in `creature` is smaller than the smallest **distance** between the matching words in `Mississippi Grind`.

The `proximity` rule sorts the results by increasing distance between matched query terms.
:::

::: tab Attribute
![Image from alias](../../public/image/belgium.png)

### Attribute

`If It's Tuesday, This must be Belgium` is the first document because the matched word `Belgium`, is found in the `title` attribute and not the `description`.

The `attribute` rule sorts the results by [attribute importance](/guides/main_concepts/relevancy.md#importance-of-the-attributes).

:::

::: tab Words position

![Image from alias](../../public/image/belgium.png)

### Word position

`Gangsta` appears before `Dunkirk` because `Belgium` appears sooner in the attribute.

The `word position` rule sorts the results by increasing matching word's index number.

:::

::: tab Exactness
![Image from alias](../../public/image/knight.png)

### Exactness

`Knight Moves` is displayed before `Knights of Badassdom`. `Knight` is exactly the same as the search query `Knight` whereas there is a letter of difference between `Knights` and the search query `Knight`.

:::

::::

## Order of the rules

By default, the built-in rules are executed in the following order to meet most standard needs.

```json
["typo", "words", "proximity", "attribute", "wordsPosition", "exactness"]
```

Depending on your needs, you might want to change this order of importance. To do so, you can use the [settings route](/references/ranking_rules.md#update-ranking-rules) of your index.

## Adding your rules

New rules can be added to the existing list at any time and placed anywhere in the sequence.

A custom rule allows you to create an ascending or descending sorting rule on a given attribute.

To add your own ranking rule, you have to communicate either `asc` for ascending order or `desc` for descending order followed by the field name in brackets.

- To apply an **ascending sorting** (results sorted by increasing value of the attribute): `asc(attribute_name)`

- To apply a **descending sorting** (results sorted by decreasing value of the attribute): `desc(attribute_name)`

Add this rule to the existing list of ranking rules using the [settings route](/references/ranking_rules.md#update-ranking-rules).

#### Example

Let's say you have a dataset of movies. The documents contain the fields `release_date` with a timestamp as value, and `movie_ranking` an integer that represents its ranking.

The following example will create a rule that makes older movies more relevant than more recent ones. A movie released in 1999 will appear before a movie released in 2020.

```
asc(release_date)
```

The following example will create a rule that makes movies with a good rank more relevant than movies with a lower rank. Movies with a higher ranking will appear first.

```
desc(movie_ranking)
```

To add a rule to the existing ranking rule, you have to add the rule to the existing ordered rules array using the [settings route](/references/ranking_rules.md#update-ranking-rules),

```json
[
  "typo",
  "attribute",
  "proximity",
  "words",
  "wordsPosition",
  "exactness",
  "asc(release_date)",
  "desc(movie_ranking)"
]
```

## Importance of the attributes

In a dataset, some fields are more relevant to the search than others. A `title`, for example, has a value more meaningful to a movie search than its `description` or its `director` name.

By default, the order of importance of the attributes is based on their order of appearance in the first document added. Then, each new attribute found in new documents will be added at the end of this ordered list.

If you wish to specify the order of the attributes you can either define them in the settings or set the correct order in the first document indexed.

### Changing the order of the attributes

You may want to change the order once the documents have been ingested. This is still very possible using the [searchable attributes list](/guides/advanced_guides/field_properties.md#searchable-fields).

Whenever a document is added to MeiliSearch, all new attributes found in it are automatically added to two lists:

- **The [searchable attributes list](/references/searchable_attributes.md)**: Attributes of the fields in which to search for matching query words.
- **The [displayed attributes list](/references/displayed_attributes.md)**: Attributes of the fields displayed in documents.

This searchable attributes list is **ordered**, which means the order in which the attributes appear in the list determines their relevancy. Attributes are arranged from the most important attribute to the least important attribute.

Place the attributes in the desired order and send this updated list using the [settings routes](/references/settings.md). Attributes will be re-ordered.

#### Example

```json
["title", "description", "director"]
```

If you take a look at the above order, the matching words found in `title` will make the document more relevant than one with the same matching words found in `description` or `director`.
