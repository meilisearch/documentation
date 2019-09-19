# API Documentation

## Response Status Code

#### Success

- **200** : Ok, for all get methods request
- **201** : Created, for all post method request
- **202** : Accepted, for all put and delete methods request
- **205** : Reset Content, for a clear request

#### Error

- **400**: Bad Request, A global error, see the JSON message to understand the issue
- **401**: Unauthorized, an authentification header is missing
- **403**: Forbidden, the token have not the permissions
- **404**: Not Found, the requested resource is not found, it could be an `index` or if a document is missing an identifier.


Response body :

```json
{
     "message": "A message error"
}
```

## Routes

||||
|-|-|-|
| <span class="get_method">GET</span>  | /indexes                                   | [Get all indexes](/indexes#list-all-indexes) |
| <span class="get_method">GET</span>  | /indexes/`:index`                          | [Get one index](/indexes#get-index) |
| <span class="get_method">GET</span> | /indexes/`:index`/documents/`:identifier`   | [Get one document](/documents#get-one-document) |
| <span class="get_method">GET</span> | /indexes/`:index`/documents                 | [Browse documents](/documents#browse-documents) |
| <span class="get_method">GET</span>   | /indexes/`:index`/search                  | [Search in an index](/search#search-in-index) |
| <span class="post_method">POST</span> | /indexes/`:index`/documents               | [Add or Update documents](/documents#create-documents) |
| <span class="post_method">POST</span> | /indexes/`:index`/documents/clear         | [Add or Update documents](/documents#create-documents) |
| <span class="post_method">POST</span> | /indexes/`:index`/documents/batch         | [Batch write documents](/documents#batch-documents) |
| <span class="post_method">POST</span> | /indexes/`:index`/documents/clear         | [Clear all documents](/documents#create-documents) |
| <span class="delete_method">DELETE</span> | /indexes/`:index`/documents           | [Delete multiple documents](/documents#delete-documents) |
| <span class="delete_method">DELETE</span> | /indexes/`:index`/documents/`:documentId` | [Delete one document](/documents#delete-document) |
