Update the API reference documentation from the OpenAPI spec.

## Steps

1. **Fetch the latest OpenAPI spec** from the Meilisearch repository:
   ```
   npm run fetch-meilisearch-openapi-file
   ```

2. **Generate the Mintlify-compatible OpenAPI file**:
   ```
   npm run generate-mintlify-openapi-file
   ```

3. **Check for new routes** that need coverage:
   ```
   npm run check-openapi-routes-coverage
   ```

4. **Generate code sample snippets**:
   ```
   npm run generate-code-sample-snippets-file
   ```

5. **Check code samples**:
   ```
   npm run check-openapi-code-samples
   npm run check-code-samples-usage
   npm run check-missing-sdk-samples
   npm run check-unused-sdk-samples
   ```

6. **Report**: Summarize what changed:
   - New routes added (if any)
   - Missing code samples (if any)
   - Any errors from the scripts

If new routes were added, remind the user that they may need to:
- Add MDX stub files for new endpoints
- Update the docs.json navigation if new route groups were created
- Add code samples for the new endpoints
