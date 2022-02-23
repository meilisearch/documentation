# Tenant tokens

In this guide you'll first learn [what multitenancy is](#what-is-multitenancy) and [how tenant tokens help managing complex applications and sensitive data](#what-are-tenant-tokens-and-how-do-they-solve-multitenancy-in-meilisearch). Then, you'll see [how to generate and use tokens](#generating-tenant-tokens-with-an-sdk), whether with an official SDK or [otherwise](#generating-tenant-tokens-without-a-meilisearch-sdk). The guide ends with a quick explanation of [the main tenant token settings](#tenant-token-settings).

## What is multitenancy?

In software development, multitenancy means that multiple users with different interests—also called tenants—share the same computing resources. Despite existing in the same environment, tenants are not aware of one another and do not have access to each other's data. Proper multitenancy is crucial in cloud computing services such as [Digital Ocean's Droplets](https://www.digitalocean.com/products/droplets) and [Amazon's AWS](https://aws.amazon.com/).

Depending on the type of application you are developing with Meilisearch, it is possible you will face similar challenges. For example, if your application handles sensitive data like medical records, it is very important to make sure users can only search through their own documents.

### What are tenant tokens and how do they solve multitenancy in Meilisearch?

Tokens are small packages of encrypted data presenting proof a user can access a certain resource.

Tokens contain not only security credentials, but also instructions on how that resource must be presented to the user. These instructions are enforced in every query made with that specific token.

For example, you can program your healthcare application so it generates a token whenever a user logs in:

```json
{
  "apiKeyPrefix": "rkDxFUHd",
  "exp": 1641835850,
  "searchRules": {
    "patient_medical_records": {
      "filter": "user_id = 1",
    }
  }
}
```

This token fragment contains data proving the user is authorized to search the `patient_medical_records` index. It also tells Meilisearch to only return documents owned by that specific user.

### Tenant tokens in Meilisearch

Tenant tokens do not require you to configure any specific instance options or index settings.

To use tenant tokens, you only need to have a system for token generation in place. Once a token has been generated, you can seamlessly substitute an API key with it when accessing the API's search endpoint.

The quickest method to generate tenant tokens is [using one of our official SDKs](#generating-tenant-tokens-with-an-sdk). However, it is also possible to [generate the token without relying on any dependencies](#generating-tenant-tokens-without-a-meilisearch-sdk).

## Generating tenant tokens with an SDK

If you are developing an application that allows patients to search through medical records, it is crucial that each user can only see their own records and not anyone else's.

The code in this example imports the SDK, creates a filter based on the current user's ID, and feeds that data into the SDK's `generateTenantToken` function. Once the token is generated, it is stored in the `token` variable:

```js
// placeholder code sample. Final version will be supplied by the integrations team
// <CodeSamples id="tenant_token_guide_generate_sdk_1">
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

As you can see, there are three main elements necessary to generate a tenant token: [search rules](#search-rules), [expiry dates](#expiry-date), and [API keys](#api-keys). You can read more about each one these in [this guide's final section](#tenant-token-settings).

### Using a tenant token with an SDK

The resulting token, stored on the `token` variable, can then be sent back to the front-end and used to make queries that will only return results whose `user_id` attribute equals the current user's ID:

```js
// placeholder code sample. Final version will be supplied by the integrations team
// <CodeSamples id="tenant_token_guide_sdk_search_1">
const frontEndClient = new Meilisearch({
  apiKey: token
});

const medicalRecordsIndex = frontEndClient.index('patient_medical_records');
const search = medicalRecordsIndex.search('blood test');
```

Applications may use tenant tokens and API keys interchangeably when searching. For example, the same application might use a default search API key for queries on public indexes and a tenant token for logged-in users searching on private data.

## Generating tenant tokens without a Meilisearch SDK

Though [Meilisearch recommends using an official SDK](#generating-tenant-tokens-with-an-sdk), this is not a requirement. Since tenant tokens follow the JWT standard, you can use a number of [compatible third-party helper libraries](https://jwt.io/libraries). You may also skip all assistance and generate a token from scratch.

The full process requires you to [create a token header](#creating-a-token-header), [prepare a data payload](#preparing-a-data-payload) with at least one set of search rules, and then [sign the token](#signing-a-token) with an API key.

::: note
The following examples use javascript for the sake of simplicity, but Meilisearch should be compatible with the majority of modern stacks and languages.
:::

### Creating a token header

The first step when generating a tenant token is to create a header stating token type and the chosen encryption algorithm. Once that is done you must encode the header object into `base64`:

```js
let header = {
  "alg": "HS256",
  "typ": "JWT"
}

const base64Header = base64Encode(header);
```

The encryption algorithm indicated by `alg` can be one of: `HS256`, `HS384`, or `HS512`. The choice of algorithm has no impact in tenant token behavior.

Meilisearch only supports JWT tokens and `typ` must always be `JWT`.

### Token payload

Once the header is ready, you must create a payload. In this case, payload means the data containing the token's API key prefix, search rules, and optional expiry date.

First, you must extract the first eight characters from a valid API key with access to the search endpoint:

```js
const meiliSearchApikey = '[an_api_key]';
const yourApiKeyPrefix = meiliSearchApiKey.slice(0,8);
```

Your payload must also contain a `searchRules` object. The following example would force all searches made with the token to only return results with a `user_id` of `1`:

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

You can also optionally set an expiry date for your token. Tokens are invalid once past their expiry date.

Like the header, it is necessary to encode the payload:

```js
const base64Payload = base64Encode(payload);
```

### Signing a token

Tokens following the JWT standard must be signed. The signature is created by concatenating the encoded header and payload using a `.` as the separator, then encrypting the resulting string. **The encryption key must be the same you used when generating the payload's API key prefix.**

```js
const signature = HS256(base64Header + '.' + base64Payload, meiliSearchApiKey);
```

This example uses an HS256 encryption algorithm. **The encryption algorithm you use must be the same as the one indicate in the token's header.**

The remaining step is putting it all together. Concatenate the header, payload, and signature using a `.` to separate each element of the token:

```js
const yourTenantToken = base64Header + '.' + base64Payload + '.' + signature;
```

### Using a tenant token without an SDK

Your token is ready. Tenant tokens can seamlessly replace any requests made to the search endpoint:

<CodeSamples id="tenant_token_guide_search_no_sdk_1" />

::: note
The `curl` example presented here is only for illustration purposes. In production environments, you would likely send the token to the front-end of your application and query indexes from there.
:::

## Tenant token settings

### Search rules

Search rules are a set of instructions defining search parameters that will be enforced in every query made with a specific tenant token.

`searchRules` must contain a JSON object specifying rules that will be enforced on any queries using this token. Each rule is itself a JSON object and must follow this pattern:

```json
{
 "[index_name]": {
   "[search_parameter]": "[value]"
 }
}
```

The object key must be an index name. Its value must consist of any number of `key:value` pairs. The `key` must be a [search parameter](/reference/api/search.md#search-parameters) and the value must be a valid argument for that parameter.

This example rule declares that every search made in the `patient_medical_records` index must return results chronologically sorted results:

```json
{
  "patient_medical_records": {
    "sort": "date:desc"
  }
}
```

Search rules can combine any number of search parameters. This rule requires all results to be sorted chronologically and excludes documents not belonging to belonging to a specific user:

```json
{
  "patient_medical_records": {
    "sort": "date:desc",
    "filter": "user_id = 1"
  }
}
```

It is also possible to create search rules that apply to all indexes in an instance by using the `*` wildcard. The following search rule forces every query using its token to only return results whose `user_id` equals `1`:

```json
{
  "*": {
    "filter": "user_id = 1"
  }
}
```

A token may contain rulesets for any number of indexes. Each ruleset may contain any number of search rules. **When both a `*` wildcard ruleset and a ruleset specific to one index apply, specific rulesets overwrite the wildcard.**

In the example below, we must declare `"filter": "user_id = 1"` twice—once when dealing with the global case for all indexes, and once when defining rules that only apply to the `medical_records` index:

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

You can create search rules using any combination of search parameters. For an exhaustive list and description of these parameters, [take a look at our API reference](/reference/api/search.md#search-parameters).

In [the previous SDK example](#generating-tenant-tokens-with-an-sdk), the search rules are an object stored in `searchRules`:

```js
// placeholder code sample. Final version will be supplied by the integrations team
// <CodeSamples id="tenant_token_guide_fragment_rules_1">
const searchRules = {
  'patient_medical_records': {
    'filter': `user_id = ${currentUserID}`
  }
};
const token = client.generateTenantToken(searchRules, expiryDate, apiKey);
```

### API Keys

Creating a token requires an API key. A token has access to the same indexes as the API key used to generate it.

For security reasons, we strongly recommend you avoid exposing the API key whenever possible and **always generate tokens on your application's back-end**.

When using an official Meilisearch SDK, you may indicate which API key you wish to use when generating a token. Consult the documentation of the SDK you are using for more specific instructions.

In [the previous SDK example](#generating-tenant-tokens-with-an-sdk), the API key is stored in `apiKey`:

```js
// placeholder code sample. Final version will be supplied by the integrations team
// <CodeSamples id="tenant_token_guide_fragment_key_1">
const apiKey = '[an_api_key]';
const token = client.generateTenantToken(searchRules, expiryDate, apiKey);
```

::: note
If an API key expires, any token tenants created with it will become invalid. The same applies if the API key is deleted or regenerated due to a changed master key.
:::

[You can read more about API keys in our dedicated guide.](/learn/security/master_api_keys.md)

### Expiry date

It is possible to define an expiry date when generating a token. This is good security practice and Meilisearch recommends setting relatively short token expiry dates whenever possible. The expiry date must be written as a UNIX timestamp.

::: danger
The only way to revoke a token without an expiry date is to delete its parent API key.

Changing an instance's master key forces Meilisearch to regenerate all API keys and will also render all existing tenant tokens invalid.
:::

When using an official Meilisearch SDK, you may indicate the expiry date when generating a token. Consult the documentation of the SDK you are using for more specific instructions.

In [the previous SDK example](#generating-tenant-tokens-with-an-sdk), the expiry date is stored in `expiryDate`:

```js
// placeholder code sample. Final version will be supplied by the integrations team
// <CodeSamples id="tenant_token_guide_fragment_expiry_1">
const expiryDate = 1645461882;
const token = client.generateTenantToken(searchRules, expiryDate, apiKey);
```
