# Tenant tokens

When developing complex applications or handling sensitive data, the control over security and permissions offered by API keys might not be enough. This is where tenant tokens and multitenancy come in.

In this guide you'll first learn what multitenancy is and how tenant tokens solve it. Then, you'll see how to generate and use tokens using either one of our official SDKs or completely from scratch.

## What is multitenancy?

In software development, multitenancy means that multiple users with different interests—also called tenants—share the same computing resources. Despite coexisting in the same environment, tenants are never aware of one another and do not have access to each other's data. Proper multitenancy is crucial in cloud computing services such as Digital Ocean's droplets or Amazons AWS.

Depending on the type of application you are developing with Meilisearch, it is possible you will face similar challenges. For example, if your application handles sensitive data like medical records, it is very important that a user can only search through their own information.

### What are tenant tokens and how do they solve multitenancy in Meilisearch?

Tokens are a form of short-lived authorization and authentication. They are essentially small packages of encrypted data containing proof a user can access a certain resource.

Tokens can contain not only security data, but also instructions on how that resource is presented to the user. Meilisearch uses this information to force every query made with a tenant token to follow certain rules.

To continue with the medical records example, you can create a token every time a user logs into your application. This token contains data informing Meilisearch that the user has access to certain resources, as long as they belong to that specific user.

## Generating tenant tokens

There are no specific instance options or index settings required to activate tenant tokens. Instead, all a developer must to in order to use tenant tokens is to generate a token.

Once the token is ready, you can seamlessly substitute an API key with it when accessing an API route.

The quickest method to generate tenant tokens is using one of our official SDKs.  It is also possible to generate the token from scratch, without any any dependencies.

### Tenant token anatomy

Before generating a token, it is helpful to understand what it is and what are its components.

A tenant token is made out of two parts: header and payload.

#### Token header

The header contains preliminary information regarding the token and how it was constructed. A header must have two fields:

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

`typ` specifies the token type. Meilisearch only accepts [JWT tokens](https://jwt.io/).

`alg` specifies which encryption algorithm is used for the token signature. Meilisearch accepts three algorithms:

- `HS256`
- `HS384`
- `HS512`

::: note
Discussing the differences between these algorithms is out of scope for this article. You can find more information on [how to choose the best solution for your application in this guide by `someone`](need to find a link).
:::

#### Token payload

The payload contains instructions to your Meilisearch instance. It must have three fields:

```json
{
  "apiKeyPrefix": "rkDxFUHd",
  "exp": 1641835850,
  "searchRules": {
    "*": {
      "filter": "user_id = 1"
    }
  }
}
```

`apiKeyPrefix` must be a string matching the first 8 characters of a valid Meilisearch API key. This proves the token is allowed to access a resource.

`exp` must contain a UNIX epoch specifying when the token's expiry date. For security reasons, tokens are meant to be short-lived. Once a token is expired, it cannot be used anymore and must be regenerated.

`searchRules` must contain a JSON object specifying rules that will be enforced on any queries using this token. Each rule is itself a JSON object and must follow this pattern:

```json
{
 "[index_name]": {
   "[search_parameter]": "[value]"
 }
}
```

The object key must be an index name. Its value must consist of any number of `key:value` pairs. The `key` must be a [search parameter](/reference/api/search.md#search-parameters) and the value must be a valid parameter.

In the example payload, the token has one search rule that applies to all indexes in that instance, represented by the wildcard `*`. This search rule itself forces every query using this token to only return results whose `user_id` equals `1`.

```json
"*": {
  "filter": "user_id = 1"
}
```

A token may contain rulesets for any number of indexes. Each ruleset may contain any number of search rules. When both a wildcard ruleset and a ruleset specific to one index apply, specific rulesets overwrite the wildcard. In the example below, we must declare `"filter": "user_id = 1"` twice—once when dealing with the global case for all indexes, and once when defining rules that only apply to the `medical_records` index:

```json
{
  "apiKeyPrefix": "rkDxFUHd",
  "exp": 1641835850,
  "searchRules": {
    "*": {
      "filter": "user_id = 1"
    },
    "medical_records": {
      "filter": "user_id = 1",
      "sort": "date:desc"
    }
  }
}
```

### Generating tenant tokens with an SDK

Token generation requires no particular configuration of your instance or indexes; all you need to do to get started with tenant tokens is a process generating the tokens on your application's back-end.

The easiest way to generate Meilisearch tenant tokens is using one of our SDKs.

If you are developing an application that deals with medical records, it is very likely you have many users. Since medical records are an extremely sensitive type of data, it is fundamental that each user can only see their own records and not anyone else's.

The code in this example imports the SDK, creates a filter based on the current user's ID, and feeds that data into the SDK's `generateTenantToken` function:

```js
const client = new Meilisearch({host: 'meilisearch'});

const apiKey = '[an_api_key]';
const currentUserID = '[placeholder_user_id]';

const searchRules = {
  'patient_medical_records': {
    'filter': `user_id = ${currentUserID}`
  }
};

const expiryDate = 1645461882;

const token = client.generateTenantToken(searchRules, expiryDate, apiKey);
```

The resulting token, stored on the `token` variable, can then be sent back to the front-end and used to make queries that will only return results whose `user_id` attribute equals the current user's ID:

```js
const frontEndClient = new Meilisearch({
  apiKey: token
});

const medicalRecordsIndex = client.index('patient_medical_records');
const search = client.search('blood test');
```

::: warning
Creating a token requires an API key with access to [the search endpoint](/reference/api/search.md). For security reasons, we strongly recommend you avoid exposing the API key whenever possible and **always generate tokens on your application's back-end**.
:::

### Other ways of generating tenant tokens

Though Meilisearch recommends generating tokens with an official SDK, token creation requires no specific method. Since tenant tokens follow the JWT standard, you can use a number of [compatible third-party helper libraries](https://jwt.io/libraries).

You may also skip all assistance and generate a token from scratch.

::: note
The following examples use javascript for the sake of simplicity, but Meilisearch should be compatible with the majority of modern stacks and languages.
:::

The first step when generating a tenant token is to create a header stating token type and the chosen encryption algorithm. Once that is done you must encode the header object into `base64`:

```js
let header = {
  "alg": "HS256",
  "typ": "JWT"
}

const base64Header = base64Encode(header);
```

Once the header is ready, you must create a payload. First, you must extract the first eight characters from a valid API key with access to the search endpoint:

```js
const meiliSearchApikey = '[an_api_key]';
const yourApiKeyPrefix = meiliSearchApiKey.slice(0,8);
```

Your payload must also contain a `searchRules` object. The following example would force all searches made with the token to only return results with a `user_is` of `1`:

```js
const yourSearchRules = {
  "patient_medical_records": {
    "filter": "user_id = 1"
  }
}
```

With both these steps completed, you are ready to generate the token payload:

```js
const payload = {
  "apiKeyPrefix": yourApiKeyPrefix,
  "exp": 1641835850,
  "searchRules": yourSearchRules
}

```

As you may have noticed, you can also optionally set an expiry date for your token. Tokens are invalid once past their expiry date.

Like the header, it is necessary to encode the payload:

```js
const base64Payload = base64Encode(payload);
```

Tokens following the JWT standard must be signed. The signature is created by concatenating the encoded header and payload using a `.` as the separator, then encrypting the resulting string. **The encryption key must be the same you used when prefixing your payload.**

```js
const signature = HS256(base64Header + '.' + base64Payload, meiliSearchApiKey);
```

This example uses an HS256 encryption algorithm. You may also use HS384 and HS512.

The remaining step is putting it all together, using a `.` to separate each element of the token:

```js
const yourTenantToken = base64Header + '.' + base64Payload + '.' + signature;
```

Your token is ready. Tenant tokens can seamlessly replace any requests made to the search endpoint:

```bash
curl \
  -X POST 'http://127.0.0.1:7700/indexes/patient_medical_records/search' \
  -H 'Authorization: Bearer [yourTenantToken]'
```