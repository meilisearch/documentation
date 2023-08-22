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
 * comment is added to the PR.
 */

interface Comment {
  id: number
}

const COMMENT_TAG = '<!-- LINK_CHECKER_COMMENT -->'

const { context, getOctokit } = github
const octokit = getOctokit(process.env.GITHUB_TOKEN!)
const { owner, repo } = context.repo
const pullRequest = context.payload.pull_request!
const sha = pullRequest.head.sha

async function findBotComment(): Promise<Comment | undefined> {
  try {
    const { data: comments } = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number: pullRequest.number,
    })

    return comments.find((c) => c.body?.includes(COMMENT_TAG))
  } catch (error) {
    setFailed('Error finding bot comment: ' + error)
    return undefined
  }
}

async function updateComment(
  comment: string,
  botComment: Comment
): Promise<string> {
  try {
    const { data } = await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: botComment.id,
      body: comment,
    })

    return data.html_url
  } catch (error) {
    setFailed('Error updating comment: ' + error)
    return ''
  }
}

async function createComment(comment: string): Promise<string> {
  const isFork = pullRequest.head.repo.fork
  if (isFork) {
    setFailed(
      'The action could not create a Github comment because it is initiated from a forked repo. View the action logs for a list of broken links.'
    )

    return ''
  } else {
    try {
      const { data } = await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pullRequest.number,
        body: comment,
      })

      return data.html_url
    } catch (error) {
      setFailed('Error creating comment: ' + error)
      return ''
    }
  }
}

async function updateCheckStatus(
  errorsExist: boolean,
  commentUrl?: string
): Promise<void> {
  const isFork = pullRequest.head.repo.fork
  const checkName = 'Docs Link Validation'

  let summary, text

  if (errorsExist) {
    summary =
      'This PR introduces broken links to the docs. Click details for a list.'
    text = `[See the comment for details](${commentUrl})`
  } else {
    summary = 'No broken links found'
  }

  const checkParams = {
    owner,
    repo,
    name: checkName,
    head_sha: sha,
    status: 'completed',
    conclusion: errorsExist ? 'failure' : 'success',
    output: {
      title: checkName,
      summary: summary,
      text: text,
    },
  }

  if (isFork) {
    if (errorsExist) {
      setFailed(
        'This PR introduces broken links to the docs. The action could not create a Github check because it is initiated from a forked repo.'
      )
    } else {
      console.log('Link validation was successful.')
    }
  } else {
    try {
      await octokit.rest.checks.create(checkParams)
    } catch (error) {
      setFailed('Failed to create check: ' + error)
    }
  }
}

const runAction = async (comment: string, errorsExist: boolean) => {
  const botComment = await findBotComment()
  let commentUrl
  const commentWithTag = `${COMMENT_TAG}\n${comment}`

  if (botComment) {
    commentUrl = await updateComment(commentWithTag, botComment)
  } else {
    commentUrl = await createComment(commentWithTag)
  }

  try {
    await updateCheckStatus(errorsExist, commentUrl)
  } catch (error) {
    setFailed('Failed to create Github check: ' + error)
  }
}

validateAllInternalLinks('.', setFailed, sha, runAction)
