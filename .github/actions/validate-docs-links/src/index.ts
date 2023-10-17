import * as github from '@actions/github'
import { setFailed } from '@actions/core'
import { validateAllInternalLinks } from './checker'
/**
 * This script validates internal links in /docs including internal,
 * hash, source and related links. It does not validate external links.
 * 1. Collects all .mdx files.
 * 2. For each file, it extracts the content, metadata, and heading slugs.
 * 3. It creates a document map to efficiently lookup documents by path.
 * 4. It then traverses each document modified in the PR and...
 *    - Checks if each internal link points
 *      to an existing document
 *    - Validates hash links (links starting with "#") against the list of
 *      headings in the current document.
 *    - Checks the source and related links found in the metadata of each
 *      document.
 * 5. Any broken links discovered during these checks are categorized and a
 * comment is added to the Action output.
 */

const { context } = github
const pullRequest = context.payload.pull_request!
const sha = pullRequest.head.sha

validateAllInternalLinks('.', setFailed, sha)
