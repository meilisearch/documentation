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
