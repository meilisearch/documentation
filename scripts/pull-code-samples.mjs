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
  },
  {
    language: 'javascript',
    label: 'Vanilla JS',
    project: 'instant-meilisearch'
  },
  {
    language: 'javascript',
    label: 'React',
    project: 'meilisearch-react'
  },
  {
    language: 'javascript',
    label: 'Vue.js',
    project: 'meilisearch-vue'
  },
  {
    language: 'javascript',
    label: 'Vue3.js',
    project: 'meilisearch-vue',
    source: '.code-samples-vue-3.meilisearch.yaml' //vue3 specific source
  }
];

const REPOS = SDK.map(sdk => 
  `https://raw.githubusercontent.com/meilisearch/${sdk.project}/main/${sdk.source || '.code-samples.meilisearch.yaml'}`
);

const OUTPUT_DIR = path.join(process.cwd(), 'snippets/samples');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });


function extractLanguageFromUrl(repoUrl) {
  const match = repoUrl.match(/meilisearch-([a-zA-Z]+)/);
  return match ? match[1] : 'text'; // Default to 'text' if not found
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

async function processRepos() {
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

  // Write each sample name content to a file in the snippets folder
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
  const cleanBlock = block.replace(/^[a-z]+\s*/, '').replace(/```$/, '');
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
    console.log(`Saved: ${operationName}.mdx`);
  }
}

processRepos();