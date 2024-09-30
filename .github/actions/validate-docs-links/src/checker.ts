const fs = require('fs/promises')
const path = require('path')
const unified = require('unified')
const markdown = require('remark-parse')
const remarkMdx = require('remark-mdx')
const remarkToRehype = require('remark-rehype')
const raw = require('rehype-raw')
const visit = require('unist-util-visit')
const matter = require('gray-matter')
const GithubSlugger = require('github-slugger')
import type { Node, Data } from 'unist'
/**
 * This script validates internal links in /docs including internal,
 * hash, source and relative links. It does not validate external links.
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
 * comment is added to the PR.
 */

interface Document {
  body: string
  path: string
  slug: string
  headings: string[]
  sidebarDepth?: number
}

interface Errors {
  doc: Document
  link: string[]
  hash: string[]
  source: string[]
  relative: string[]
}

type ErrorType = Exclude<keyof Errors, 'doc'>

/** Label: Is the text that will be displayed in the sidebar */
type RouteSchema = {source: string, label: string, slug: string}

/**
* Source: Is the path to the .mdx file
*
* Slug: Is the route we will use to access the page in the browser
*/
type RouteFragment = Omit<RouteSchema, 'label'>

type FooterConfigSchema = Array<RouteSchema |
{
  "to": string,
  "label": string,
  "slug": string
}>

type ConfigSchema =  Array<{title: string, slug: string, routes: Array<RouteSchema>}>
type FailureFunction =  (message: string) => void

const RELATIVE_PATH = '/'
const EXCLUDED_HASHES: string[] = []
const EXCLUDED_PATHS: string[] = ['/movies.json']

const slugger = new GithubSlugger()

// Collect the paths of all .mdx files present in the config files
async function getAllMdxFilePaths(basePath: string): Promise<RouteFragment[]> {
  const sidebarLearn: ConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-learn.json'), 'utf8'))
  const sidebarReference: ConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-reference.json'), 'utf8'))
  const sidebarGuides: ConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-guides.json'), 'utf8'))
  const footer: FooterConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-footer.json'), 'utf8'))

  const config = [
    ...sidebarLearn.map(group => ({...group, slug: path.join('learn',  group.slug)})),
    ...sidebarReference.map(group => ({...group, slug: path.join('reference/', group.slug)})),
    ...sidebarGuides.map(group => ({...group, slug: path.join('guides/', group.slug)}))
  ]

  let allRoutes: RouteSchema[] = [{source: path.join(basePath, 'home.mdx'), slug: '', label: 'Homepage'}]
  for (const group of config) {
    allRoutes = allRoutes.concat(group.routes.map(route => ({
      ...route,
      slug: path.join(group.slug, route.slug),
      source: path.join(basePath, route.source)
    })))
  }
  footer.forEach(item => 'source' in item && allRoutes.push({...item, source: path.join(basePath, item.source)}))

  return allRoutes
}

// Returns the slugs of all headings in a tree
function getHeadingsFromMarkdownTree(tree: Node<Data>): string[] {
  const headings: string[] = []
  slugger.reset()

  visit(tree, 'heading', (node: Node<Data>) => {
    let headingText = ''
    // Account for headings with inline code blocks by concatenating the
    // text values of all children of a heading node.
    visit(node, (node: any) => {
      if (node.value) {
        headingText += node.value
      }
    })
    headings.push(slugger.slug(headingText))
  })

  return headings
}

// Create a processor to parse MDX content
const markdownProcessor = unified()
  .use(markdown)
  .use(remarkMdx)
  .use(remarkToRehype, { allowDangerousHTML: true })
  .use(raw)
  .use(function compiler() {
    // A compiler is required, and we only need the AST, so we can
    // just return it.
    // @ts-ignore
    this.Compiler = function treeCompiler(tree) {
      return tree
    }
  })

// use Map for faster lookup
let documentMap: Map<string, Document>

// Create a map of documents with their paths as keys and
// document content and metadata as values
// The key varies between doc pages and error pages
// error pages: `/docs/messages/example`
// doc pages: `api/example`
async function prepareDocumentMapEntry(
  route: RouteFragment,
  setFailed: FailureFunction
): Promise<[string, Document]> {
  try {
    const mdxContent = await fs.readFile(route.source, 'utf8')
    const { content, data } = matter(mdxContent)
    const tree = markdownProcessor.parse(content)
    const headings = getHeadingsFromMarkdownTree(tree)

    return [
      route.slug,
      { body: content, path: route.source, slug: route.slug, headings, ...data },
    ]
  } catch (error) {
    setFailed(`Error preparing document map for file ${route}: ${error}`)
    return ['', {} as Document]
  }
}

// Checks if the links point to existing documents
function validateInternalLink(errors: Errors, href: string): void {
  // Split the href into link and hash
  // href could be: /reference/api/settings?utm_campaign=...#hash
  const [linkWithQueryAndHash, hash] = href.split('#')

  // Remove query parameters from the link
  const linkWithQuery = linkWithQueryAndHash
  const link = linkWithQuery.split('?')[0]

  if (EXCLUDED_PATHS.includes(link)) return

  if (link.startsWith('/assets')) return

  // Check if doc page exists
  const foundPage = documentMap.get(link.replace(/^\/+/, ''))

  if (!foundPage) {
    errors.link.push(href)
  } else if (hash && !EXCLUDED_HASHES.includes(hash)) {
    const hashFound = foundPage.headings.includes(hash)

    if (!hashFound) {
      errors.hash.push(href)
    }
  }
}

// Checks if the hash links point to existing sections within the same document
function validateHashLink(errors: Errors, href: string, doc: Document): void {
  const hashLink = href.replace('#', '')

  if (!EXCLUDED_HASHES.includes(hashLink) && !doc.headings.includes(hashLink)) {
    errors.hash.push(href)
  }
}

// Checks if the source link points to an existing document
function validateSourceLinks(doc: Document, errors: Errors): void {
  if (doc.slug && !documentMap.get(doc.slug)) {
    errors.source.push(doc.path)
  }
}

// Traverse the document tree and validate links
function traverseTreeAndValidateLinks(tree: any, doc: Document, setFailed: FailureFunction): Errors {
  const errors: Errors = {
    doc,
    link: [],
    hash: [],
    source: [],
    relative: [],

  }

  // Matches markdown links like [text](link) (excluding those that end with a file extension)
  const linkRegex = /^(?!.*\.[a-zA-Z]+\)$)\[[^\[\]]+\]\([^\(\)]+\)$/gm

  // Matches all links that use some kind of protocol (e.g. http://, https://, mailto:, etc.)
  const nonInternalLinkRegex = /^(?:[a-z+]+:)?\/\/|^[a-z]+:/i

  function validateNodes(node: any, parse: boolean = false) {
    // Handle links in custom components that were not correctly parsed
    if (node.type === 'text' && linkRegex.test(node.value)) {
      const customComponentTree = markdownProcessor.parse(node.value)
      traverseRecursively(customComponentTree)
    }

    if (
      (node.type === 'element' && node.tagName === 'a') ||
      node.type === 'link' ||
      node.type === 'buttonlink'
    ) {
      const href = node.properties?.href ?? node.url

      if (!href) return

      // Check if the link is an internal link and not ending with a file extension
      if (href.startsWith(RELATIVE_PATH)) {
        if(!/^.*\.[^\\]+$/.test(href)){
          validateInternalLink(errors, href)
        }
      } else if (href.startsWith('#')) {
        validateHashLink(errors, href, doc)
      } else if (!nonInternalLinkRegex.test(href)) {
        errors.relative.push(href)
      }
    } else if (node.type === 'element' && "route" in node.properties) {
      const href = node.properties.route

      if (!href) return

      // Check if the link is an internal link and not ending with a file extension
      if (href.startsWith(RELATIVE_PATH)) {
        if(!/^.*\.[^\\]+$/.test(href)){
          validateInternalLink(errors, href)
        }
      } else if (href.startsWith('#')) {
        validateHashLink(errors, href, doc)
      } else if (!nonInternalLinkRegex.test(href)) {
        errors.relative.push(href)
      }
    }
  }

  function traverseRecursively (tree: any) {
    try {
      visit(tree, validateNodes)
      validateSourceLinks(doc, errors)
    } catch (error) {
      setFailed('Error traversing tree: ' + error)
    }
  }

  traverseRecursively(tree)

  return errors
}

const formatTableRow = (
  link: string,
  errorType: ErrorType,
  docPath: string,
  sha?: string
) => {
  if (process.argv[2] === '--run-local-checker') return `| ${link} | ${errorType} | /${docPath} | \n`
  return `| ${link} | ${errorType} | [/${docPath}](https://github.com/meilisearch/documentation/blob/${sha}/${docPath}) | \n`
}

// Main function that triggers link validation across .mdx files
export async function validateAllInternalLinks(basePath: string, setFailed: FailureFunction, sha?: string): Promise<void> {
  try {
    const allMdxFilePaths = await getAllMdxFilePaths(basePath)

    documentMap = new Map(
      await Promise.all(allMdxFilePaths.map(route => prepareDocumentMapEntry(route, setFailed)))
    )

    const docProcessingPromises = allMdxFilePaths.map(async (route) => {
      const doc = documentMap.get(route.slug)
      if (doc) {
        const tree = (await markdownProcessor.process(doc.body)).contents
        return traverseTreeAndValidateLinks(tree, doc, setFailed)
      } else {
        return {
          doc: {} as Document,
          link: [],
          hash: [],
          source: [],
          relative: [],
        } as Errors
      }
    })

    const allErrors = await Promise.all(docProcessingPromises)

    let errorsExist = false

    let errorRows: string[] = []

    const errorTypes: ErrorType[] = ['link', 'hash', 'source', 'relative']
    allErrors.forEach((errors) => {
      const {
        doc: { path: docPath },
      } = errors

      errorTypes.forEach((errorType) => {
        if (errors[errorType].length > 0) {
          errorsExist = true
          errors[errorType].forEach((link) => {
            errorRows.push(formatTableRow(link, errorType, docPath, sha))
          })
        }
      })
    })

    if (errorsExist) {
      const errorTableData = allErrors.flatMap((errors) => {
        const { doc } = errors

        return errorTypes.flatMap((errorType) =>
          errors[errorType].map((link) => ({
            docPath: doc.path,
            errorType,
            link,
          }))
        )
      })

      setFailed('This PR introduces broken links to the docs:')
      console.table(errorTableData, ['link', 'errorType', 'docPath'])
    } else {
      console.log("This PR doesn't introduce any broken links to the docs. :D")
    }
  } catch (error) {
    setFailed('Error validating internal links: ' + error)
  }
}

if (process.argv[2] === '--run-local-checker') {
  validateAllInternalLinks('../../../', (message) => {throw new Error(message)})
}
