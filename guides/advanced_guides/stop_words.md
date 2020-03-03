# Stop words

Stop-words allows you to create a list of words **ignored in your search queries**.

During a search, the stop-words contained in your search query will be ignored by the sorting algorithm.
I.e., if `the` is a stop word, and your search query contains `the`, the number of occurrences of `the` in any of your documents will have no impact on the search results.

Stop-words **improves** **the speed** and **relevancy** of a search.

::: tip
Using stop-words allows the search to focus on more relevant elements rather than words that appears very frequently in your dataset.
:::

## Language driven

Stop-words are strongly related to the language in which your data is written. Thus "the" or "of" are words that are very common in the English language and could be less relevant than a more specific word.

However, their recurrence in the data makes them decisive for calculating the relevance of a document, which could be counterproductive. In most cases it is more desirable to ignore any recurrence of these words and to base research results on more relevant distinctions.

### Example

Let's take a movie dataset where the release year is written in timestamp format like this:

```json
{
  "id": "299537",
  "title": "Captain Marvel",
  "poster": "https://image.tmdb.org/t/p/w1280/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
  "overview": "The story follows Carol Danvers as she becomes one of the universe’s most powerful heroes when Earth is caught in the middle of a galactic war between two alien races. Set in the 1990s, Captain Marvel is an all-new adventure from a previously unseen period in the history of the Marvel Cinematic Universe.",
  "release_date": 1551830400
}
```
Let's make a search on this dataset

#### Without stop words

```bash
$ curl -G \
  -X GET 'http://localhost:7700/indexes/movies_uid/search?limit=3' \
  --data-urlencode "q=the road to "
```

```json
{
  "hits": [
    {
      "id": "31804",
      "title": "The Road to Hong Kong",
      "overview": "Bob Hope and Bing Crosby return as con men Chester Babcock and Harry Turner, in the last of their road movies. When Chester accidentally memorizes and destroys the only copy of a secret Russian formula for a new and improved rocket fuel, they are thrust into international intrigue, trying to stay alive while keeping the formula out of enemy hands.",
      "release_date": -252460800,
      "poster": "https://image.tmdb.org/t/p/w1280/50vcozuZ03PD8xD7sQfUqca3UvE.jpg"
    },
    {
      "id": "10467",
      "title": "The Road to Wellville",
      "overview": "An unhappy young couple visit the infamous Kellogg spa in Battle Creek, Michigan while a young hustler tries get into the breakfast-cereal business and compete against John Kellogg's corn flakes.",
      "release_date": 783302400,
      "poster": "https://image.tmdb.org/t/p/w1280/zh7OVdFMpqpZ027z9RgVIwzxYjZ.jpg"
    },
    {
      "id": "7872",
      "title": "The Road to Guantanamo",
      "overview": "Part drama, part documentary, The Road to Guantánamo focuses on the Tipton Three, a trio of British Muslims who were held in Guantanamo Bay for two years until they were released without charge.",
      "release_date": 1141862400,
      "poster": "https://image.tmdb.org/t/p/w1280/2ttqAXqS1kUGMLg7itTQ1jVCU6M.jpg"
    }
  ],
  "offset": 0,
  "limit": 3,
  "processingTimeMs": 48,
  "query": "the road to "
}
```

`The Road to Hong Kong` is the first film in our search results. It is there because of the recurrence of the words "the" and "of" in the title and description. However, it is the oldest film in the documents offered.

The number of occurrences of common words impacts a lot the search results. If we want to focus on more relevant information, `the`, `of` and `to` should be added to the stop word list.
#### Let's add some stop words

```bash
$ curl \
  -X PUT 'http://localhost:7700/indexes/movies_uid/settings/stop-words' \
  --data '["the", "of", "to"]'
```

and let's try the same search again.

```json
{
  "hits": [
    {
      "id": "20618",
      "title": "Road Trip: Beer Pong",
      "overview": "It’s Road Trip - Beer Pong! Three college roommates are on the ride of their lives when they drop everything to join a bus full of sexy, scantily clad models to compete in the ultimate sport competition: the National Beer Pong Tournament.",
      "release_date": 1249952400,
      "poster": "https://image.tmdb.org/t/p/w1280/g3SnxYhaysmCn3V7nmwI3ZvRLth.jpg"
    },
    {
      "id": "4147",
      "title": "Road to Perdition",
      "overview": "Mike Sullivan works as a hit man for crime boss John Rooney. Sullivan views Rooney as a father figure, however after his son is witness to a killing, Mike Sullivan finds himself on the run in attempt to save the life of his son and at the same time looking for revenge on those who wronged him.",
      "release_date": 1026435600,
      "poster": "https://image.tmdb.org/t/p/w1280/jn0GH8klINSQtRNifY8W2Kv4ajl.jpg"
    },
    {
      "id": "10135",
      "title": "Road House",
      "overview": "The Double Deuce is the meanest, loudest and rowdiest bar south of the Mason-Dixon Line, and Dalton (Patrick Swayze) has been hired to clean it up. He might not look like much, but the Ph.D.-educated bouncer proves he's more than capable -- busting the heads of troublemakers and turning the roadhouse into a jumping hot-spot. But Dalton's romance with the gorgeous Dr. Clay (Kelly Lynch) puts him on the bad side of cutthroat local big shot Brad Wesley (Ben Gazzara).",
      "release_date": 611542800,
      "poster": "https://image.tmdb.org/t/p/w1280/epxeFRI1Ig3CU7hnz9pZVkarfOz.jpg"
    }
  ],
  "offset": 0,
  "limit": 3,
  "processingTimeMs": 16,
  "query": "the road to "
}
```

this time the results are much more related to the release date
of the film rather than the number of recurrences of the stop-words. The response time is much shorter too, from `48ms` to `16ms`

You can see where the line is drawn between the importance of getting rid of stop-words and also the relevance those words can give to you search.

Find the best way they will fit for you !
