import * as fs from "fs";
import * as path from "path";
import {
  buildVersionPageFile,
  getProjectPaths,
  listExistingVersions,
  parseUpdateBlocks,
  regenerateIndexCards,
  syncChangelogNavigation,
} from "./changelog-utils.js";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const paths = getProjectPaths(path.dirname(SCRIPT_DIR));

function main() {
  const source = paths.legacyMonolith;
  if (!fs.existsSync(source)) {
    console.error(`Legacy monolith not found: ${source}`);
    process.exit(1);
  }

  const content = fs.readFileSync(source, "utf-8");
  const blocks = parseUpdateBlocks(content);

  if (blocks.length === 0) {
    console.error("No <Update> blocks found in legacy changelog.");
    process.exit(1);
  }

  fs.mkdirSync(paths.versionsDir, { recursive: true });

  console.log(`Splitting ${blocks.length} version(s)...`);
  for (const block of blocks) {
    const outPath = path.join(paths.versionsDir, `${block.label}.mdx`);
    if (fs.existsSync(outPath)) {
      console.log(`  Skip (exists): ${block.label}`);
      continue;
    }
    fs.writeFileSync(outPath, buildVersionPageFile(block.label, block.date, block.body));
    console.log(`  Wrote: ${block.label}`);
  }

  const versions = listExistingVersions(paths.versionsDir);
  regenerateIndexCards(paths.indexMdx, versions);
  syncChangelogNavigation(
    paths.navJson,
    versions.map((v) => v.label)
  );

  fs.unlinkSync(source);
  console.log(`\nRemoved legacy file: ${source}`);
  console.log(`Index: ${paths.indexMdx}`);
  console.log(`Navigation synced with ${versions.length} version page(s).`);
}

main();
