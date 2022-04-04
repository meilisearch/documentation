# Master key and API keys

This guide will teach you how to protect your Meilisearch instance by setting a master key and how to authorize requests using API keys. You will also learn how to use your master key to create, list, update, and delete API keys with granular permissions.

## Protecting a Meilisearch instance

**By default, Meilisearch's API is unprotected**. This means all routes are publicly accessible, and require no authorization to access.

To protect a Meilisearch instance from unauthorized use, you must supply a master key at launch. This master key can be an alphanumeric string of any length.

Setting up a master key can be done with either command-line options or environment variables. You can read more about [master key configuration in our instance configuration guide](/learn/configuration/instance_options.md#master-key).

:::: tabs
::: tab CLI

```sh
./meilisearch --master-key="your_master_key"
```

:::

::: tab Environment variable

Linux/MacOS:

```sh
export MEILI_MASTER_KEY="your_master_key"
./meilisearch
```

Windows:

```sh
set MEILI_MASTER_KEY="your_master_key"
./meilisearch
```

:::
::::

Once you launch Meilisearch with a master key, all API endpoints except [the health endpoint](/reference/api/health.md#get-health) are automatically protected from unauthorized requests.

From that point on, API requests must include the `Authorization` header to be successful. Read on to learn more.

## Communicating with a protected instance

After an instance is secured, only the [`GET /health` endpoint](/reference/api/health.md) will be publicly available. To access any other API endpoint, you must add a security key with suitable permissions to your request.

It is particularly important to protect an instance when dealing with sensitive data. You can use API keys to ensure only authorized people can search through an index containing medical records:

<CodeSamples id="security_guide_search_key_1" />

### Using default API keys for authorization

When you launch an instance for the first time, Meilisearch will automatically generate two API keys: `Default Search API Key` and `Default Admin API Key`.

As its name indicates, the `Default Search API Key` can only be used to access [the search route](/reference/api/search.md).

The second automatically-generated key, `Default Admin API Key`, has access to all API routes except `/keys`. You should avoid exposing the default admin key in publicly accessible code.

::: warning
Both default API keys have access to all indexes in an instance and do not have an expiry date. They can be [retrieved](#listing-api-keys), [modified](#updating-an-api-key), or [deleted](#deleting-an-api-key) the same way as user-created keys.
:::

### Differences between the master key and API keys

Meilisearch currently has two types of security keys: one master key and any number of API keys.

Though both types of keys help you protect your instance and your data, they serve distinct purposes and are managed in different ways.

API keys grant users access to a specific set of indexes, routes, and endpoints. You can also configure them to expire after a certain date. They can be configured by using the [`/keys` route](/reference/api/keys.md).

For most of your day-to-day operations, you should use API keys when communicating with a protected instance.

When you launch an instance for the first time, Meilisearch creates two default API keys: [`Default Search API Key` and `Default Admin API Key`](#using-default-api-keys-for-authorization).

While API keys are designed to have limited permissions, the master key grants users full control over an instance. The master key is the only key with access to endpoints for creating and deleting API keys. Since the master key is not an API key, it cannot be configured and listed through the `/keys` endpoints.

Exposing your master key can give malicious users complete control over your Meilisearch instance. We strongly recommend you **only use the master key when managing API keys**.

## Using the master key to manage API keys

Meilisearch gives you fine-grained control over which users can access which indexes, endpoints, and routes. When protecting your instance with a master key, you can ensure only authorized users can carry out sensitive tasks such as adding documents or altering index settings.

The master key is the only key with access to the [`/keys` route](/reference/api/keys.md). This route allows you to [create](#creating-an-api-key), [update](#updating-an-api-key), [list](#listing-api-keys), and [delete](#deleting-an-api-key) API keys.

Though the default API keys are usually enough to manage the security needs of most applications, this might not be the case when dealing with privacy-sensitive data. In these situations, the fine-grained control offered by the `/keys` endpoint allows you to clearly decide who can access what information and for how long.

### Updating an API key

You can freely update an API key at any time, even after it expires. This includes editing the indexes, endpoints, and routes it can access, as well as its description and expiry date.

We can update the `Default Search API Key` so regular users cannot perform search operations in our `patient_medical_records` index:

<CodeSamples id="security_guide_update_key_1" />

```json
{
  "description": "Default Search API Key",
  "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
  "actions": [
    "search"
  ],
  "indexes": [
    "doctors"
  ],
  "expiresAt": null,
  "createdAt": "2022-01-01T10:00:00Z",
  "updatedAt": "2022-01-01T10:00:00Z"
}
```

To update an API key, you must use the [update API key endpoint](/reference/api/keys.md#update-a-key) which can only be accessed with the master key.

Meilisearch supports partial updates with the `PATCH` route. This means your payload only needs to contain the data you want to update—in this case, `indexes`.

### Creating an API key

You can create API keys by using the [create key endpoint](/reference/api/keys.md#create-a-key). This endpoint is always protected and can only be accessed with the master key.

Since we have altered the permissions in our default search key, we need to create a new API key so authorized users can search through out `patient_medical_records` index:

<CodeSamples id="security_guide_create_key_1" />

All [`/keys` endpoints](/reference/api/keys.md) are synchronous, so your key will be generated immediately:

```json
{
  "description": "Search patient records key",
  "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
  "actions": [
    "search"
  ],
  "indexes": [
    "patient_medical_records"
  ],
  "expiresAt": "2023-01-01T00:00:00Z",
  "createdAt": "2022-01-01T10:00:00Z",
  "updatedAt": "2022-01-01T10:00:00Z"
}
```

It is good practice to always set an expiry date when creating a new API key. If you are sure that is not necessary in your application, you can create an API key with no expiry date by explicitly passing a `null` value to `expiresAt`.

### Listing API keys

You can use the [list keys endpoint](/reference/api/keys.md) to obtain information on any active key in your Meilisearch instance. This is useful when you need an overview of existing keys and their permissions.

[`GET /keys`](/reference/api/keys.md#get-all-keys) returns a full list of all existing keys. **Expired keys will appear in the response, but deleted keys will not**. As with creating, deleting, and updating API keys, you need the master key to access this endpoint.

[`GET /keys/{key}`](/reference/api/keys.md#get-one-key) returns information on a single key. `{key}` should be replaced with the full `key` value obtained during key creation.

We can query our instance to confirm which active keys can search our `patient_medical_records` index:

<CodeSamples id="security_guide_list_keys_1" />

```json
{
  "results": [
    {
      "description": "Default Search API Key (Use it to search from the frontend code)",
      "key": "0a6e572506c52ab0bd6195921575d23092b7f0c284ab4ac86d12346c33057f99",
      "actions": [
          "search"
      ],
      "indexes": [
          "doctors"
      ],
      "expiresAt": null,
      "createdAt": "2021-08-11T10:00:00Z",
      "updatedAt": "2021-08-11T10:00:00Z"
    },
    {
      "description": "Default Admin API Key (Use it for all other operations. Caution! Do not share it on the client side)",
      "key": "380689dd379232519a54d15935750cc7625620a2ea2fc06907cb40ba5b421b6f",
      "actions": [
          "*"
      ],
      "indexes": [
          "*"
      ],
      "expiresAt": null,
      "createdAt": "2021-08-11T10:00:00Z",
      "updatedAt": "2021-08-11T10:00:00Z"
    },
    {
      "description": "Search patient records key",
      "key": "d0552b41536279a0ad88bd595327b96f01176a60c2243e906c52ac02375f9bc4",
      "actions": [
        "search"
      ],
      "indexes": [
        "patient_medical_records"
      ],
      "expiresAt": "2023-01-01T00:00:00Z",
      "createdAt": "2022-01-01T10:00:00Z",
      "updatedAt": "2022-01-01T10:00:00Z"
    }
  ]
}
```

### Deleting an API key

If a key is no longer useful or has been compromised, you can use [delete key endpoint](/reference/api/keys.md#delete-a-key) to disable it before its expiry date.

If we accidentally exposed our `Search patient records key`, we can delete it to prevent unauthorized parties from gaining access to our `patient_medical_records` index:

<CodeSamples id="security_guide_delete_key_1" />

### Expired keys

Once a key is past its `expiresAt` date, using it for API authorization will return an error. Expired keys will still be returned by the [list keys endpoint](/reference/api/keys.md#get-all-keys).

If you must continue using an expired key, you may use the [update key endpoint](/reference/api/keys.md#update-a-key) to set a new `expiresAt` date and effectively reactivate it.

## Changing the master key

To change the master key, first terminate your Meilisearch instance. Then relaunch it, [supplying a new value for the master key](#protecting-a-meilisearch-instance).

**Changing an instance's master key renders all active API keys invalid and generates new values for each one of them.** This is useful if your security is severely compromised and you must reset all API key values at once.

## Disabling security

You can disable instance protection by restarting Meilisearch without providing a master key:

:::: tabs
::: tab CLI

If your master key was set up using the command-line option, relaunch the instance without the `--master-key` option:

```sh
./meilisearch
```

:::

::: tab Environment variable

If your master key was configured with an environment variable, unset `MEILI_MASTER_KEY` and relaunch the instance.

Linux/MacOS:

```sh
export MEILI_MASTER_KEY=
./meilisearch
```

Windows:

```sh
set MEILI_MASTER_KEY=
./meilisearch
```

:::
::::

::: danger
We strongly advise against deactivating key-based security for any Meilisearch instances used in production or containing sensitive information.
:::

## Further security measures

API keys alone might not be enough to handle more complex situations such as multi-tenant indexes. If your application must manage several users and sensitive data, we recommend you [consider using tenant tokens](/learn/security/tenant_tokens.md).
