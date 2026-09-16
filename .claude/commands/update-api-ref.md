Update the API reference documentation from the OpenAPI spec.

## Steps

1. **Fetch the latest assets** (OpenAPI spec and error codes from the Meilisearch repository, and the Meilisearch Cloud OpenAPI spec from the private meilisearch-cloud repository; the latter requires `GITHUB_PAT` or `GH_TOKEN`):
   ```
   npm run fetch-assets
   ```

2. **Generate the error codes page** (regenerates `reference/errors/error_codes.mdx` from the newly fetched `meilisearch-error-codes.json`):
   ```
   npm run generate-error-codes
   ```

3. **Generate the Mintlify-compatible OpenAPI files** (engine with code samples, Cloud without):
   ```
   npm run generate-mintlify-openapi-file -- --with-code-samples assets/engine-release-assets/meilisearch-openapi.json
   npm run generate-mintlify-openapi-file -- assets/cloud-assets/meilisearch-cloud-openapi.yaml
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
   npm run check-openapi-code-samples
   npm run check-code-samples-usage
   npm run check-missing-sdk-samples
   npm run check-unused-sdk-samples
   ```

7. **Report**: Summarize what changed:
   - New routes added (if any)
   - Missing code samples (if any)
   - Any errors from the scripts

If new routes were added, remind the user that they may need to:
- Add MDX stub files for new endpoints
- Update the docs.json navigation if new route groups were created
- Add code samples for the new endpoints
