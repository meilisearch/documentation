const fs = require('fs/promises')
const path = require('path')
const unified = require('unified')
const markdown = require('remark-parse')
const remarkToRehype = require('remark-rehype')
const raw = require('rehype-raw')
const visit = require('unist-util-visit')
const matter = require('gray-matter')
const GithubSlugger = require('github-slugger')
import type { Node, Data } from 'unist'
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
  related: string[]
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
const EXCLUDED_HASHES = ['top']

const slugger = (require.main === module) ? {
  slug: (str: string) => str.replace(/\s+/g, '-').toLowerCase(),
  reset: () => null
} : new GithubSlugger()

// Collect the paths of all .mdx files present in the config files
async function getAllMdxFilePaths(basePath: string): Promise<RouteFragment[]> {
  const sidebarLearn: ConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-learn.json'), 'utf8'))
  const sidebarReference: ConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-reference.json'), 'utf8'))
  const footer: FooterConfigSchema = JSON.parse(await fs.readFile(path.join(basePath, 'config/sidebar-footer.json'), 'utf8'))

  const config = [
    ...sidebarLearn.map(group => ({...group, slug: path.join('learn',  group.slug)})),
    ...sidebarReference.map(group => ({...group, slug: path.join('reference/', group.slug)}))
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
  // /docs/api/example#heading -> ["api/example", "heading""]
  const [link, hash] = href.split('#')

  // check if doc page exists
  const foundPage = documentMap.get(link.replace(/^\/+/, ''))
  

  if (!foundPage) {
    errors.link.push(href)
  } else if (hash && !EXCLUDED_HASHES.includes(hash)) {
    // TODO: Check if this block is still needed
    // // Account for documents that pull their content from another document
    // const foundPageSource = foundPage.source
    //   ? documentMap.get(foundPage.source)
    //   : undefined

    // Check if the hash link points to an existing section within the document
    // const hashFound = (foundPageSource || foundPage).headings.includes(hash)
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
    related: [],
  }

  try {
    visit(tree, (node: any) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties.href

        if (!href) return

        if (href.startsWith(RELATIVE_PATH)) {
          validateInternalLink(errors, href)
        } else if (href.startsWith('#')) {
          validateHashLink(errors, href, doc)
        }
      }
    })

    validateSourceLinks(doc, errors)
  } catch (error) {
    setFailed('Error traversing tree: ' + error)
  }

  return errors
}

const formatTableRow = (
  link: string,
  errorType: ErrorType,
  docPath: string,
  sha?: string
) => {
  if (require.main === module) return `| ${link} | ${errorType} | /${docPath} | \n`
  return `| ${link} | ${errorType} | [/${docPath}](https://github.com/meilisearch/documentation/blob/${sha}/${docPath}) | \n`
}

// Main function that triggers link validation across .mdx files
export async function validateAllInternalLinks(basePath: string, setFailed: FailureFunction, sha?: string, useComment?: (comment: string, errorsExist: boolean) => Promise<void>): Promise<void> {
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
          related: [],
        } as Errors
      }
    })

    const allErrors = await Promise.all(docProcessingPromises)

    let errorsExist = false

    let errorRows: string[] = []

    const errorTypes: ErrorType[] = ['link', 'hash', 'source', 'related']
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

    const errorComment = [
      'Hi there :wave:\n\nIt looks like this PR introduces broken links to the docs, please take a moment to fix them before merging:\n\n| Broken link | Type | File | \n| ----------- | ----------- | ----------- | \n',
      ...errorRows,
      '\nThank you :pray:',
    ].join('')

    if (errorsExist) {
      await useComment?.(errorComment, errorsExist)
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

      console.log('This PR introduces broken links to the docs:')
      console.table(errorTableData, ['link', 'type', 'docPath'])
    } else {
      await useComment?.('All broken links are now fixed, thank you!', errorsExist)
      console.log("This PR doesn't introduce any broken links to the docs. :D")
    }
  } catch (error) {
    setFailed('Error validating internal links: ' + error)
  }
}

if (require.main === module) {
  validateAllInternalLinks('../../../', (message) => {throw new Error(message)})
}
