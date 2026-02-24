# Agent instructions for Meilisearch documentation

When editing or proposing content in this documentation repository, follow these guidelines.

## Documentation philosophy

Our documentation aims to be:

- **Efficient**: we don't want to waste anyone's time
- **Accessible**: reading the texts here shouldn't require native English or a computer science degree
- **Thorough**: the documentation website should contain all information anyone needs to use Meilisearch
- **Open source**: this is a resource by Meilisearch users, for Meilisearch users

## Quality checklist (when writing or reviewing docs)

Use these questions when creating or editing documentation:

1. **Accuracy** — Is the information accurate?
2. **Clarity** — Is it easy to understand?
3. **Code samples** — Do the code samples run without errors? Do they help users understand what we are explaining?
4. **English** — Is the English clear and concise? Can a non-native speaker understand it?
5. **Grammar and typos** — Is the grammar correct? Are there any typos?
6. **Brevity** — Can we shorten text without losing any important information?
7. **Cross-references** — Do the suggested changes require updating other pages in the documentation website?
8. **Placement and discoverability** — For new content: is the article in the right place? Should other articles in the documentation link to it?

## Practical guidelines

- Prefer **short, direct sentences** and avoid jargon when a simpler term exists.
- Keep **code samples minimal and runnable**; they should illustrate the concept, not add noise.
- When adding or moving content, **update or add links** from related pages so users can find it.
- Match the existing **tone and structure** of the docs (see `learn/resources/contributing_docs.mdx` and surrounding files for reference).

### cURL examples in `/learn/` and API reference

When adding a cURL example in `/learn/` or in the **API reference** (`/reference/api`), **do not** write the example as raw code directly in the page. Instead:

1. Add the sample in **`.code-samples.meilisearch.yaml`** (follow the existing format: section comments, key name, and `|-` block with the curl command).
2. Run the project’s **code-samples generation** so the snippet is produced under `snippets/generated-code-samples/`.
3. **Import and use** the generated snippet in the MDX page (e.g. `import CodeSamplesXxx1 from '/snippets/generated-code-samples/code_samples_xxx_1.mdx'` and `<CodeSamplesXxx1 />`).

This keeps examples centralized, testable, and consistent across the docs.

## Prose and writing-style rules

When writing or editing documentation text, apply the following. They replace the former Vale-based checks.

### Spelling and terminology

- **American English**: use American spelling (e.g. *analyze*, *behavior*, *color*, *center*, *license*, *canceled*, *cancelation*, *program*, *labeling*, *initialed*, *favorite*, *dependent*). Avoid British variants (*analyse*, *behaviour*, *colour*, *centre*, *licence*, *cancelled*, *cancellation*, *programme*, *labelling*, *initialled*, *favourite*, *dependant*).
- **Indexing**: use "indexing", not "indexation".
- **Product name**: always "Meilisearch" (not MeiliSearch, MieliSearch, meiliSearch).
- **Technical and product names**: spell as in official sources (e.g. Meilisearch, Algolia, Vue, Nginx, OpenAPI, JSON, SDK, CLI, GitHub, Docker, Kubernetes, etc.). When in doubt, keep the form used in the rest of the docs.

### Grammar and punctuation

- **Oxford comma**: use the serial comma in lists (e.g. "A, B, and C").
- **Acronyms and initialisms**: no periods (e.g. "HTML", "API", not "H.T.M.L").
- **Semicolons**: use sparingly; prefer splitting into two sentences or rewording for clarity.
- **Spacing**: one space between words and one space after sentence-ending punctuation (e.g. period, question mark) before the next sentence. No double spaces.

### Style and readability

- **First person**: avoid "I", "me", "my", "mine" in general docs; first person is acceptable in FAQs or similar.
- **Headings**: use sentence-style capitalization (first word and proper nouns only). Exceptions: product names (Meilisearch, GitHub, etc.), acronyms (API, CLI, SDK, JSON), and patterns like "Step 1: Do this" or "1. Do this".
- **Latin abbreviations**: prefer "for example" and "that is" over "e.g." and "i.e." so the text stays accessible.
- **Sentence length**: prefer shorter sentences; if a sentence runs over ~40 words, consider splitting or simplifying.
- **Repetition**: avoid repeated words in a row (e.g. "This is is wrong").

### Wording

- **URL/HTML**: write "a URL", "an HTML" (not "an URL", "a HTML"). Prefer "URL of" over "URL for" where it reads naturally.

### Quality

- **Merge conflicts**: do not leave merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) in documentation content.
