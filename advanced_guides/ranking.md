# Ranking

<!-- Ranking/SETTING : override tout ce qui existait deja

ranking rules : 
- Liste de ranking rule custom
- Permet de creer


 -attribut +att
{
  "nom_de_la_ranking_rule_et_nom_du_champ_qui_sert_de_ranking" : asc || dsc
}

ranking order : 
  List des rules dans l ordre d importance.
  Peut contenir les rules par defaut ou des custom rules. Voir ranking rule 

default : 
  "_sum_of_typos" => builder.push(SumOfTypos),
                        "_number_of_words" => builder.push(NumberOfWords),
                        "_word_proximity" => builder.push(WordsProximity),
                        "_sum_of_words_attribute" => builder.push(SumOfWordsAttribute),
                        "_sum_of_words_position" => builder.push(SumOfWordsPosition),
                        "_exact" => builder.push(Exact),


distinct_field "Nom du champ"

un string d'un champ distinct

par exemple skuid sur une liste de vetement de differentes couleur

 -->


MeiliSearch uses ranking rules called `criteria` or `criterion`. They are used in the [bucket sort](/advanced_guides/bucket_sort)

## Ranking rules

MeiliSearch has default `criteria`.

Here is the list of all the `criteria` that are executed in this specific order by default:

- `Number of Typos` - The less typos there are beween the query words and the document words, the more relevant is the document.
- `Number of Words` - A document containing more of the query words will be more important than one that contains less.
- `Words Proximity` - The closer the query words are in the document the better is the document.
- `Attribute` - A document containing the query words in a more important attribute than another document is considered better.
- `Position` - A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.
- `Exact` - A document containing the query words in their exact form, not only a prefix of them, is considered better.


## Custom ranking rules

Custom ranking rules gives you the possibility to add new rules. New rules can be added on attributes that has the `ranked` tag in the [schema](/main_concept/indexes.md#ranked).

A rule is defined by an **attribute** and a **ascendent** `asc` or **descendent** `dsc` property.

The name of the ranking rule is the name of the attribute on which the rule is made. 

For those rules to be applied by MeiliSearch on your search queries, it must be added to the [ranking order](/advanced_guides/ranking.md#ranking-order).

::: warning
If the rule is not added to the rule ranking order, it will be **ignored** by MeiliSearch.
:::

### Example

On the `release_date` attribute of a movie data set, which contains the timestamp of the release date. 
```bash
 curl --request POST 'http://localhost:8080/indexes/movies/settings' 
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '{ "rankingRules" : { "release_date": "dsc" } }'
```

We create a custom ranking rule that must have the attribute name as key : `release_date` and we ask it to be `dsc` which means *descending*.

Now if added to the ranking order documents will be ordered by descending release_date.

## Ranking order

The ranking order determine the order of each rule in the [bucket sort](/advanced_guides/bucket_sort).

The default ranking order is as follows ([*see above for more detail about each rule*](/advanced_guides/ranking.md#ranking-rules)) :

- `Number of Typos` 
- `Number of Words` 
- `Words Proximity`
- `Attribute`
- `Position` 
- `Exact` 

[The ranking order can be changed](/references/settings.html#add-settings). Rules can be removed by omitting them in the ranking order list, and custom rules must be added in the ranking order list to be applied.

Each time you create **a new ranking rule it must be added to the existing ranking order to be applied** by the [bucket sort](/advanced_guides/bucket_sort).

### Example

To apply the [custom ranking rule added previously](/advanced_guides/ranking.html#custom-ranking-rules), lets add it to the ranking order.

```bash
curl --request POST 'http://localhost:8080/indexes/movies/settings' \
  --header 'Content-Type: application/json' \
  --header "X-Meili-API-Key: $API_KEY" \
  --data '{
  "rankingOrder": [
    "_sum_of_typos",
    "_number_of_words",
    "_word_proximity",
    "_sum_of_words_attribute",
    "_sum_of_words_position",
    "_exact",
    "release_date"
  ]
}'
```

Now, our **search results will be ordered by descending date** after all other rules have been applied in the [bucket sort](/advanced_guides/bucket_sort).

