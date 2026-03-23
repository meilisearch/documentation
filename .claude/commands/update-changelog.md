Update the changelog from GitHub releases.

## Steps

1. **Generate the changelog**:
   ```
   npm run generate-changelog
   ```

2. **Review the output**: Check for any errors or warnings from the script.

3. **Verify the generated files**: Look at the changelog directory for new or updated entries. Show the user a summary of what releases were added or updated.

4. **Check docs.json**: If new changelog pages were generated, verify they are included in the Changelog tab navigation in docs.json. Add any missing entries.

5. **Report**: Summarize what was generated:
   - Number of new releases added
   - Any releases that failed to generate
   - Whether docs.json navigation needs updating
