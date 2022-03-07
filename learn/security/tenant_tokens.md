# Multitenancy and tenant tokens

In this guide you'll first learn [what multitenancy is](#what-is-multitenancy) and [how tenant tokens help managing complex applications and sensitive data](#what-are-tenant-tokens-and-how-do-they-solve-multitenancy-in-meilisearch). Then, you'll see [how to generate and use tokens](#generating-tenant-tokens-with-an-sdk), whether with an official SDK or [otherwise](#generating-tenant-tokens-without-a-meilisearch-sdk). The guide ends with a quick explanation of [the main tenant token settings](#tenant-token-payload-reference).

## What is multitenancy?

In software development, multitenancy means that multiple users with different interests—also called tenants—share the same computing resources. Proper multitenancy is crucial in cloud computing services such as [Digital Ocean's Droplets](https://www.digitalocean.com/products/droplets) and [Amazon's AWS](https://aws.amazon.com/).

If your Meilisearch application stores sensitive data belonging to multiple users in the same index, it is very important to make sure users can only search through their own documents. This can be accomplished with **tenant tokens**.

### What are tenant tokens and how are they different from API keys in Meilisearch?

Tenant tokens are small packages of encrypted data presenting proof a user can access a certain index. They contain not only security credentials, but also instructions on which documents within that index the user is allowed to see.

To use tokens in Meilisearch, you only need to have a system for token generation in place. The quickest method to generate tenant tokens is [using one of our official SDKs](#generating-tenant-tokens-with-an-sdk). It is also possible to [generate a token from scratch](#generating-tenant-tokens-without-a-meilisearch-sdk).

Tenant tokens do not require you to configure any specific [instance options](/learn/configuration/instance_options.md) or [index settings](/learn/configuration/settings.md). They are also meant to be short-lived—Meilisearch does not store nor keeps track of generated tokens.

## Generating tenant tokens with an SDK

Imagine that you are developing an application that allows patients and doctors to search through medical records. In your application, it is crucial that each patient can see only their own records and not those of another patient.

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

There are three arguments when using an SDK to generate a tenant token. In the above example, they are stored in `searchRules`, `apiKey`, and `expiryDate`.

`searchRules` is a JSON object specifying the restrictions that will be applied to search requests on a given index. It must contain at least one search rule. [More information here.](#search-rules)

`apiKey` must be a valid Meilisearch API key. A tenant token will have access to the same indexes as the API key used when generating it. If no API key is provided, the SDK might be able to infer it automatically.

`expiryDate` is optional when using an SDK. If used, this parameter must be a UNIX timestamp. Tokens becomes invalid after their `expiryDate`.

You can read more about each element of the tenant token payload in [this guide's final section](#tenant-token-payload-reference).

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

Though Meilisearch recommends [using an official SDK to generate tenant tokens](#generating-tenant-tokens-with-an-sdk), this is not a requirement. Since tenant tokens follow the [JWT standard](https://jwt.io), you can use a number of [compatible third-party libraries](https://jwt.io/libraries). You may also skip all assistance and generate a token from scratch.

The full process requires you to [create a token header](#step-1-creating-a-token-header), [prepare a data payload](#step-2-preparing-the-token-payload) with at least one set of search rules, and then [sign the token](#step-3-signing-a-token) with an API key.

If you are already familiar with the creation of JWTs and only want to know about the specific requirements of a tenant token payload, skip this section and take a look at the [token payload reference](#tenant-token-payload-reference).

::: note
The following examples use JavaScript for the sake of simplicity, but Meilisearch should be compatible with the majority of modern stacks and languages.
:::

### Step 1: Creating a token header

The first step when generating a tenant token is to create a header stating token type and the chosen encryption algorithm. Once that is done you must encode the header object into `base64`:

```js
let header = {
  "alg": "HS256",
  "typ": "JWT"
}

const base64Header = base64Encode(header);
```

The encryption algorithm indicated by `alg` can be `HS256`, `HS384`, or `HS512`. The choice of algorithm has no impact on tenant token behavior.

Meilisearch only supports JWT tokens and `typ` must always be `JWT`.

### Step 2: Preparing the token payload

Once the header is ready, you must create a payload. In this case, payload means the data containing the token's API key prefix, search rules, and optional expiry date.

First, you must extract the first eight characters from a valid API key with access to the search endpoint:

```js
const meilisearchApiKey = '[an_api_key]';
const yourApiKeyPrefix = meilisearchApiKey.slice(0,8);
```

`apiKey` must be a valid Meilisearch API key. A tenant token will have access to the same indexes as the API key you use when generating it. When generating a tenant token payload, you should only supply the first 8 characters of a key.

Your payload must also contain a `searchRules` object. The following example would limit searches made with the token to only return results with a `user_id` equal to `1`:

```js
const yourSearchRules = {
  "patient_medical_records": {
    "filter": "user_id = 1"
  }
}
```

`searchRules` must be an object containing at least one search rule. A search rule must specify either an index name or a `*` wildcard. Search rules must also declare at least one filter. In this example, the filter makes it so a user only has access to their own records.

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

You can read more about each of element of the tenant token payload in [this guide's final section](#tenant-token-payload-reference).

### Step 3: Signing a token

Tokens following the JWT standard must be signed. The signature is created by concatenating the encoded header and payload using a `.` as the separator, then encrypting the resulting string. **The encryption key must be the same you used when generating the payload's API key prefix.**

```js
const signature = HS256(base64Header + '.' + base64Payload, meiliSearchApiKey);
```

This example uses an HS256 encryption algorithm. **The encryption algorithm you use must be the same as the one indicated in the token's header.**

The remaining step is putting it all together. Concatenate the header, payload, and signature using a `.` to separate each element of the token:

```js
const yourTenantToken = base64Header + '.' + base64Payload + '.' + signature;
```

### Using a tenant token without an SDK

Your token is ready. Tenant tokens can seamlessly replace API keys to authorize requests made to the search endpoint:

<CodeSamples id="tenant_token_guide_search_no_sdk_1" />

::: note
The `curl` example presented here is only for illustration purposes. In production environments, you would likely send the token to the front-end of your application and query indexes from there.
:::

## Tenant token payload reference

Meilisearch's tenant tokens are JWTs. Their payload is made of three elements: [search rules](#search-rules), an [API key](#api-keys), and an optional [expiration date](#expiry-date).

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

The object key must be an index name. You may also use `*` instead of a specific index name—in this case, search rules will be applied to all indexes.

The object value must consist of `search_parameter:value` pairs. Currently, **tenant tokens only support the `filter` [search parameter](/reference/api/search.md#filter)**.

The following search rule forces every query across all accessible indexes to only return results whose `user_id` equals `1`:

```json
{
  "*": {
    "filter": "user_id = 1"
  }
}
```

The next rule goes a bit further. When searching on the `patient_medical_records` index, a user can only see records that belong to them and have been marked as published:

```json
{
  "patient_medical_records": {
    "filter": "user_id = 1 AND published = true"
  }
}
```

A token may contain rules for any number of indexes. **Specific rulesets take precedence and overwrite wildcard rules.**

The previous rules can be combined in one tenant token:

```json
{
  "apiKeyPrefix": "rkDxFUHd",
  "exp": 1641835850,
  "searchRules": {
    "*": {
      "filter": "user_id = 1"
    },
    "medical_records": {
      "filter": "user_id = 1 AND published = true",
    }
  }
}
```

In [the previous SDK example](#generating-tenant-tokens-with-an-sdk), the search rules are stored in `searchRules`:

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

::: danger
Because tenant tokens are generated in your application, Meilisearch cannot check if search rule filters are valid. Invalid search rules will only throw errors when they are used in a query.

Consult the search API reference [more information on Meilisearch filter syntax](/reference/api/search.md#filter).
:::

### API Keys

Creating a token requires an API key. A token has access to the same indexes as the API key used to generate it.

Since a master key is not an API key, **you cannot use a master key to create a tenant token**.

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

It is possible to define an expiry date when generating a token. This is good security practice and Meilisearch recommends setting relatively short token expiry dates whenever possible.

The expiry date must be a UNIX timestamp or `null`. Additionally, a token's expiration date cannot exceed its parent API key's expiration date. For example, if an API key is set to expire on 2022-10-15, a token generated with that API key cannot be set to expire on 2022-10-16.

Setting a token expiry date is optional, but recommended. A token without an expiry date never expires and can be used indefinitely as long as its parent API key remains valid.

::: danger
The only way to revoke a token without an expiry date is to [delete](/reference/api/keys.md#delete-a-key) its parent API key.

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
