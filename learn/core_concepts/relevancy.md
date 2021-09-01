# Relevancy

**Relevancy** is a term referring to the accuracy and effectiveness of search results. If search results are almost always appropriate, then they can be considered relevant, and vice versa.

MeiliSearch has a number of features for fine-tuning the relevancy of search results. The most important tool among them is **ranking rules**.

## Ranking rules

In order to ensure relevant results, search responses are sorted according to a set of consecutive rules called **ranking rules**.

### Behavior

Each index possesses a list of ranking rules stored as an array in the [settings object](/reference/api/settings.md). This array is **fully customizable**, meaning that **existing rules can be deleted, new ones can be added, and all can be reordered freely**.

Whenever a search query is made, MeiliSearch uses a [bucket sort](/reference/under_the_hood/bucket_sort.md) to rank documents. The first ranking rule is applied to all documents, while each subsequent rule is only applied to documents that are considered equal under the previous rule (i.e. as a tiebreaker).

**The order in which ranking rules are applied matters.** The first rule in the array has the most impact, and the last rule has the least. Our default configuration has been chosen because it meets most standard needs. [This order can be changed in the settings](/reference/api/ranking_rules.md#update-ranking-rules).

### Built-in rules

MeiliSearch contains five built-in ranking rules: **words, typo, sort, proximity, attribute, and exactness**, in that default order.

#### 1. Words

Results are sorted by **decreasing number of matched query terms**. Returns documents that contain all query terms first.

::: note
Be aware that the `words` rule works from right to left. Therefore, the order of the query string impacts the order of results.

For example, if someone were to search `batman dark knight`, then the `words` rule would rank documents containing all three terms first, documents containing only `batman` and `dark` second, and documents containing only `batman` third.
:::

#### 2. Typo

Results are sorted by **increasing number of typos**. Returns documents that match query terms with fewer typos first.

#### 3. Sort

Results are sorted according to parameters decided at query time. When the `sort` ranking rule is in a higher position, sorting is exhaustive: results will be less relevant, but follow the user-defined sorting order more closely. When `sort` is in a lower position, sorting is relevant: results will be very relevant, but might not follow the order defined by the user.

::: note
Differently from other ranking rules, this rule is only active for queries containing the `sort` search parameter with a valid value. If a search request does not contain `sort`, this rule will be ignored.
:::

#### 4. Proximity

Results are sorted by **increasing distance between matched query terms**. Returns documents where query terms occur close together and in the same order as the query string first.

#### 5. Attribute

Results are sorted according to the **[attribute ranking order](/learn/core_concepts/relevancy.md#attribute-ranking-order)**. Returns documents that contain query terms in more important attributes first.

#### 6. Exactness

Results are sorted by **the similarity of the matched words with the query words**. Returns documents that contain exactly the same terms as the ones queried first.

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

The reason why `Creature` is listed before `Mississippi Grind` is because of the `proximity` rule. The smallest **distance** between the matching words in `creature` is smaller than the smallest **distance** between the matching words in `Mississippi Grind`.

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

### Custom rules

For now, MeiliSearch supports two custom rules that can be added to [the ranking rules array](#behavior): one for ascending sort and one for descending sort.

To add a custom ranking rule, you have to communicate the attribute name followed by a colon (`:`) and either `asc` for ascending order or `desc` for descending order.

- To apply an **ascending sort** (results sorted by increasing value of the attribute): `attribute_name:asc`

- To apply a **descending sort** (results sorted by decreasing value of the attribute): `attribute_name:desc`

**The attribute must have a numeric value** in all of the documents contained in that index. **If any value is not a numeric type, the sorting rule won't be applied**.

Add this rule to the existing list of ranking rules using the [update ranking rules endpoint](/reference/api/ranking_rules.md#update-ranking-rules).

#### Example

Let's say you have a movie dataset. The documents contain the fields `release_date` with a timestamp as value, and `movie_ranking` an integer that represents its ranking.

The following example will create a rule that makes older movies more relevant than more recent ones. A movie released in 1999 will appear before a movie released in 2020.

```
release_date:asc
```

The following example will create a rule that makes movies with a good rank more relevant than movies with a lower rank. Movies with a higher ranking will appear first.

```
movie_ranking:desc
```

To add a rule to the existing ranking rule, you have to add the rule to the existing ordered rules array using the [settings route](/reference/api/ranking_rules.md#update-ranking-rules),

```json
[
  "typo",
  "attribute",
  "proximity",
  "words",
  "exactness",
  "release_date:asc",
  "movie_ranking:desc"
]
```

### Sorting and custom ranking rules

MeiliSearch allows users to define sorting order at query time by using the `sort` search parameter. There is a great deal of overlap between sorting and ranking rules, but the two do have different uses.

In general, `sort` will be most useful when you want to give users the choice of defining what type of results they want to see first. A good use-case for `sort` is giving the users of a webshop the option to sort by descending or ascending price.

Custom ranking rules, instead, are always active after configured and are useful when you want to highlight certain results. A good use-case for custom ranking rules is a webshop promoting products on sale.

## Default order

By default, the built-in rules are executed in the following order.

```json
[
  "typo", 
  "words", 
  "sort", 
  "proximity", 
  "attribute", 
  "exactness"
]
```

Depending on your needs, you might want to change this order of importance. To do so, you can use the [update ranking rules endpoint](/reference/api/ranking_rules.md#update-ranking-rules).

## Attribute ranking order

In a typical dataset, some fields are more relevant to search than others. A `title`, for example, has a value more meaningful to a movie search than its `description` or its `release_date`.

By default, the attribute ranking order is generated automatically based on the attributes' order of appearance in the indexed documents. However, it can also be set manually.

For a more detailed look at this subject, see our reference page for [the searchable attributes list](/reference/features/field_properties.md#the-searchableattributes-list).

### Example

```json
[
  "title", 
  "description", 
  "release_date"
]
```

With the above attribute ranking order, matching words found in the `title` field would have a higher impact on relevancy than the same words found in `description` or `release_date`. If you searched "1984", for example, results like Michael Radford's film "1984" would be ranked higher than movies released in the year 1984.
