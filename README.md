# API Documentation

Welcome to the beta version of the Meili Api documentation.

This is a our first draft guide into the limb of the http meili routes.
You can navigate into the documentation using the sidebar or by using the search bar above.

If you spot any typo or any error in the documentation like an miss-documented response body for example,
please contact us.

Thank you for your interest and have fun with your HTTP client 🌍

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
  "message": "An message error"
}
```
