# Search Parameters

## Filters

## Crop
<!-- crop : return value of attribute cropped to a given length 
  Starting from the first occurence of the search query ie : len 100   =>   - 50 WORD + 50
  If there is no match than it takes from the start (index 0)
  Crop takes matches into account and recalculates position of matches with the cropped version of the document.
-->

## Matches

<!-- Renvoie les indexes des occurences trouvées : 
ex "chaussure => [35, 45]

{

  "attribut" ; [
    {
      "start" : 0,
      "length" : 10 
    }
  ]
}

pub struct SearchHit {
    #[serde(flatten)]
    pub document: IndexMap<String, Value>,
    #[serde(rename = "_formatted", skip_serializing_if = "IndexMap::is_empty")]
    pub formatted: IndexMap<String, Value>,
    #[serde(rename = "_matchesInfo", skip_serializing_if = "Option::is_none")]
    pub matches_info: Option<MatchesInfos>, 

    meilidb.rs -->