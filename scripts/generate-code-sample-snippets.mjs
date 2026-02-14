import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import fetch from 'node-fetch';

const SDK = [
  {
    language: 'bash',
    label: 'cURL',
    project: 'documentation'
  },
  {
    language: 'javascript',
    label: 'JS',
    project: 'meilisearch-js'
  },
  {
    language: 'python',
    label: 'Python',
    project: 'meilisearch-python'
  },
  {
    language: 'php',
    label: 'PHP',
    project: 'meilisearch-php'
  },
  {
    language: 'java',
    label: 'Java',
    project: 'meilisearch-java'
  },
  {
    language: 'ruby',
    label: 'Ruby',
    project: 'meilisearch-ruby'
  },
  {
    language: 'go',
    label: 'Go',
    project: 'meilisearch-go'
  },
  {
    language: 'csharp',
    label: 'C#',
    project: 'meilisearch-dotnet'
  },
  {
    language: 'rust',
    label: 'Rust',
    project: 'meilisearch-rust'
  },
  {
    language: 'swift',
    label: 'Swift',
    project: 'meilisearch-swift'
  },
  {
    language: 'dart',
    label: 'Dart',
    project: 'meilisearch-dart'
  }
];

const REPOS = SDK.map(sdk =>
  `https://raw.githubusercontent.com/meilisearch/${sdk.project}/main/${sdk.source || '.code-samples.meilisearch.yaml'}`
);

const OUTPUT_DIR = path.join(process.cwd(), 'snippets/generated-code-samples');

/**
 * Remove all existing code sample snippets before regenerating them.
 * This ensures stale/unused snippets don't persist.
 */
function cleanSnippets() {
  if (!fs.existsSync(OUTPUT_DIR)) return;

  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('code_samples_') && f.endsWith('.mdx'));
  for (const file of files) {
    fs.unlinkSync(path.join(OUTPUT_DIR, file));
  }
  console.log(`Cleaned ${files.length} existing code sample snippets.`);
}

function loadLocalYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.load(content);
}

async function fetchYaml(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch samples for ${url}`);
  return yaml.load(await response.text());
}

async function buildSnippets() {
  // Step 1: Clean existing snippets
  cleanSnippets();

  // Step 2: Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Step 3: Fetch and aggregate all code samples
  const operationSnippets = {};

  for (let i = 0; i < REPOS.length; i++) {
    const repoUrl = REPOS[i];
    const sdkInfo = SDK[i];

    try {
      // Read local file for cURL samples (documentation project), fetch remote for all other SDKs
      const snippets = sdkInfo.project === 'documentation'
        ? loadLocalYaml(path.join(process.cwd(), sdkInfo.source || '.code-samples.meilisearch.yaml'))
        : await fetchYaml(repoUrl);

      for (const [operationName, snippetContent] of Object.entries(snippets)) {
        if (!operationSnippets[operationName]) {
          operationSnippets[operationName] = [];
        }

        operationSnippets[operationName].push({
          lang: sdkInfo.language,
          label: sdkInfo.label,
          content: snippetContent
        });
      }
    } catch (error) {
      console.error(`Error processing ${repoUrl}:`, error);
    }
  }

  // Step 4: Write each sample to a file in the snippets folder
  let count = 0;
  for (const [operationName, snippets] of Object.entries(operationSnippets)) {
    const filePath = path.join(OUTPUT_DIR, `code_samples_${operationName}.mdx`);
    const content = `
<CodeGroup>
${snippets.map(snippet => {
  // Split content into description and code if it contains a nested code block
  const parts = snippet.content.split('```');

  if (parts.length > 1) { // handle samples with nested code blocks
    // Has description and code blocks
    const description = parts[0].trim();
    const codeBlocks = parts.slice(1);

    // Join all parts back together, keeping the description at the top
    return `
\`\`\`text ${snippet.label}
${description}

${codeBlocks.map(block => {
  // Remove language identifier and code block markers to ensure Mintlify can parse it
  const cleanBlock = block.replace(/^[a-z]+\s*/, '').replace(/\`\`\`$/, '');
  return cleanBlock;
}).join('\n')}
\`\`\``;
  } else {
    // Regular standard code block
    return `
\`\`\`${snippet.lang} ${snippet.label}
${snippet.content}
\`\`\``;
  }
}).join('\n')}
</CodeGroup>
    `.trim();

    fs.writeFileSync(filePath, content, 'utf-8');
    count++;
  }

  console.log(`Generated ${count} code sample snippets.`);
}

buildSnippets();
