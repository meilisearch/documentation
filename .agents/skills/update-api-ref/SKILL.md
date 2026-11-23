---
name: update-api-ref
description: Update the API reference from the OpenAPI spec. Use when updating the API reference, fetching OpenAPI assets, regenerating error codes, or checking route and code-sample coverage.
---

Update the API reference documentation from the OpenAPI spec.

## Steps

1. **Fetch the latest assets** (see [CONTRIBUTING.md](../../../CONTRIBUTING.md) for the token the Cloud assets need):
   ```
   npm run fetch-assets
   ```

2. **Generate the error code lists** (injects the codes from the newly fetched `meilisearch-error-codes.json` and `meilisearch-cloud-error-codes.json` into `reference/errors.mdx` and `reference/management-api-errors.mdx`; it reports any Cloud error code that is not yet scoped to the Management API surface):
   ```
   npm run generate-error-codes
   ```

3. **Generate the Mintlify-compatible OpenAPI files** (Meilisearch API and Management API):
   ```
   npm run generate-mintlify-openapi-file
   ```

4. **Check for new routes** that need coverage:
   ```
   npm run check-openapi-routes-coverage
   ```

5. **Generate code sample snippets**:
   ```
   npm run generate-code-sample-snippets-file
   ```

6. **Check code samples**:
   ```
   npm run check-openapi-code-samples -- curl-check assets/engine-release-assets/meilisearch-openapi-mintlify.json
   npm run check-openapi-code-samples -- curl-check assets/cloud-assets/meilisearch-cloud-openapi-mintlify.json
   npm run check-code-samples-usage
   npm run check-missing-integration-samples
   npm run check-unused-integration-samples
   ```

7. **Report**: Summarize what changed:
   - New routes added (if any)
   - Missing code samples (if any)
   - Any errors from the scripts

If new routes were added, remind the user that they may need to:
- Add MDX stub files for new endpoints
- Update the docs.json navigation if new route groups were created
- Add code samples for the new endpoints. A new Management API route needs a cURL sample in the `## BEGIN /reference/management-api` section of `.code-samples.meilisearch.yaml`
