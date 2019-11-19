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

## Ranking rules

All the documents that have been aggregated using the typo rules above can now be sorted. Meili uses a [bucket sort].

What is a bucket sort? We sort all the documents with the first rule, we group all the documents that can't be distinguished with it and sort this group using the second rule, and so on.

Here is the list of all the default rules that are executed in this specific order by default:

- _Number of Typos_ - The less typos there are beween the query words and the document words, the better is the document.
- _Number of Words_ - A document containing more of the query words will be more important than one that contains less.
- _Words Proximity_ - The closer the query words are in the document the better is the document.
- _Attribute_ - A document containing the query words in a more important attribute than another document is considered better.
- _Position_ - A document containing the query words at the start of an attribute is considered better than a document that contains them at the end.
- _Exact_ - A document containing the query words in their exact form, not only a prefix of them, is considered better.

[bucket sort]: https://en.wikipedia.org/wiki/Bucket_sort
[Levenshtein algorithm]: https://en.wikipedia.org/wiki/Levenshtein_distance

## Custom ranking rules

## Ranking order