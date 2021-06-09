# Relevancy

Search responses are sorted according to a set of consecutive rules called **ranking rules**. When a search query is made, MeiliSearch uses a [bucket sort](/reference/under_the_hood/bucket_sort.md) to rank documents. Each rule is applied to all documents that are considered equal according to the previous rule to break the tie.

Ranking rules are **built-in rules applied to the search results** in order to improve their relevancy. To benefit from the ranking rules and make them meet your dataset and needs, it is important to understand how each of them works and how to create new ones.

For a more in-depth explanation of the algorithm and the default ranking rules, [see this issue](https://github.com/meilisearch/MeiliSearch/issues/358).

## Ranking rules

Ranking rules determine which documents are returned upon a search query. Each of them has a special use in finding the right results for a given search query.

The ranking rules are **customizable** which means **existing rules can be deleted and new ones can be added**.

The order in which they are applied has a significant impact on the search results. The first rules being the most impactful and the last one the least. The default order has been chosen because it meet most standard needs. **This order can be changed in the settings**.

By default, ranking rules are executed in the following order:

**1. Words**
Results are sorted by **decreasing number of matched query terms** in each matching document: find documents that contain more occurrences of the query terms first.

::: note

Be aware that the `words` rule works from right to left. Therefore, the order of the query string impacts the order of results.

For example, if someone were to search `batman dark knight`, then the `words` rule would rank documents containing all three terms first, documents containing only `batman` and `dark` second, and documents containing only `batman` third.

:::

**2. Typo**
Results are sorted by **increasing number of typos**: find documents that match query terms with fewer typos first.

**3. Proximity**
Results are sorted by **increasing distance between matched query terms**: find documents that contain more query terms found close together (close proximity between two query terms) and appearing in the original order specified in the query string first.

**4. Attribute**
Results are sorted according to the **[attribute ranking order](/learn/core_concepts/relevancy.md#attribute-ranking-order)**: find documents that contain query terms in more important attributes first.

**5. Exactness**
Results are sorted by **the similarity of the matched words with the query words**: find documents that contain exactly the same terms as the ones queried first.

#### Examples

:::: tabs

::: tab Typo

![Image from alias](/ranking-rules/vogli3.png)

### Typo

- `vogli`: 0 typo
- `volli`: 1 typo

The `typo` rule sorts the results by increasing number of typos on matched query words.

:::

::: tab Proximity
![Image from alias](/ranking-rules/new_road.png)

### Proximity

The reason why `Creature` is listed before `Mississippi Grind` is because of the `proximity` rule.
The smallest **distance** between the matching words in `creature` is smaller than the smallest **distance** between the matching words in `Mississippi Grind`.

The `proximity` rule sorts the results by increasing distance between matched query terms.
:::

::: tab Attribute
![Image from alias](/ranking-rules/belgium.png)

### Attribute

`If It's Tuesday, This must be Belgium` is the first document because the matched word `Belgium`, is found in the `title` attribute and not the `description`.

The `attribute` rule sorts the results by [attribute importance](/learn/core_concepts/relevancy.md#attribute-ranking-order).

:::

::: tab Exactness
![Image from alias](/ranking-rules/knight.png)

### Exactness

`Knight Moves` is displayed before `Knights of Badassdom`. `Knight` is exactly the same as the search query `Knight` whereas there is a letter of difference between `Knights` and the search query `Knight`.

:::

::::

## Order of the rules

By default, the built-in rules are executed in the following order to meet most standard needs.

```json
["words", "typo", "proximity", "attribute", "exactness"]
```

Depending on your needs, you might want to change this order of importance. To do so, you can use the [settings route](/reference/api/ranking_rules.md#update-ranking-rules) of your index.

## Adding your rules

New rules can be added to the existing list at any time and placed anywhere in the sequence.

A custom rule allows you to create an ascending or descending sorting rule on a given attribute. The attribute **must have a numeric value** in the documents. If any value is not a numeric type, the sorting rule won't be applied. Only numbers can be arranged in ascending or descending order.

To add your own ranking rule, you have to communicate either `asc` for ascending order or `desc` for descending order followed by the field name between round brackets.

- To apply an **ascending sorting** (results sorted by increasing value of the attribute): `asc(attribute_name)`

- To apply a **descending sorting** (results sorted by decreasing value of the attribute): `desc(attribute_name)`

Add this rule to the existing list of ranking rules using the [settings route](/reference/api/ranking_rules.md#update-ranking-rules).

#### Example

Let's say you have a movie dataset. The documents contain the fields `release_date` with a timestamp as value, and `movie_ranking` an integer that represents its ranking.

The following example will create a rule that makes older movies more relevant than more recent ones. A movie released in 1999 will appear before a movie released in 2020.

```
asc(release_date)
```

The following example will create a rule that makes movies with a good rank more relevant than movies with a lower rank. Movies with a higher ranking will appear first.

```
desc(movie_ranking)
```

To add a rule to the existing ranking rule, you have to add the rule to the existing ordered rules array using the [settings route](/reference/api/ranking_rules.md#update-ranking-rules),

```json
[
  "typo",
  "attribute",
  "proximity",
  "words",
  "exactness",
  "asc(release_date)",
  "desc(movie_ranking)"
]
```

## Attribute Ranking Order

In a typical dataset, some fields are more relevant to search than others. A `title`, for example, has a value more meaningful to a movie search than its `description` or its `release_date`.

By default, the attribute ranking order is generated automatically based on the attributes' order of appearance in the indexed documents. However, it can also be set manually.

For a more detailed look at this subject, see our reference page for [the searchable attributes list](/reference/features/field_properties.md#the-searchable-attributes-list).

#### Example

```json
["title", "description", "release_date"]
```

With the above attribute ranking order, matching words found in the `title` field would have a higher impact on relevancy than the same words found in `description` or `release_date`. If you searched "1984", for example, results like Michael Radford's film "1984" would be ranked higher than movies released in the year 1984.
