# Contributing to our documentation

This documentation website is hosted in a [public GitHub repository](https://github.com/meilisearch/documentation). It is built with [VuePress](https://vuepress.github.io), written in [MarkDown](https://www.markdownguide.org/getting-started/), and deployed on [Netlify](https://www.netlify.com).

## Our documentation philosophy

Our documentation aims to be:

- **Efficient**. We don't want to waste anyone's time.
- **Accessible**. Reading this shouldn't require native English or a computer science degree.
- **Thorough**. Behavior that isn't documented or is documented incorrectly, we consider broken.
- **Open source**. This is a resource by Meilisearch users, for Meilisearch users.

## How to contribute?

### Issues

On the Meilisearch documentation team, [GitHub Issues](https://github.com/meilisearch/documentation/issues/new/choose) are the primary tool we use to track tasks. They're like elements in our to-do list. Here are some good uses for issues:

- A detailed bug report
- A request for a new technical feature (for example, dark mode, versioning, etc.)
- A request for new content (for example, a tutorial, guide, or explanation)
- A helpful suggestion for the future of the documentation

Before opening an issue or PR, please look through our [open issues](https://github.com/meilisearch/documentation/issues) to see if one already exists for your problem. If yes, please leave a comment letting us know that you're waiting for a fix or willing to work on it yourself. If not, please open a new issue describing the problem and informing us whether you want to work on it or not.

We love issues at Meilisearch, because they help us do our jobs better. Nine times out of ten, the most useful contribution is a simple GitHub issue that points out a problem and proposes a solution.

#### Creating your first issue

All you need to create an issue is a [GitHub account](https://github.com).

1. Log into your account.
2. Go to the Meilisearch [Documentation repository](https://github.com/meilisearch/documentation).
3. Click on "Issues".
4. Use the search bar to make sure nobody else has reported your issue already. If somebody has, give them an upvote 👍 and **don't create that issue**!
5. Click "New issue".
6. Fill in a short, descriptive title and longer summary of your problem or suggestion. If you're reporting a bug, make sure to include steps to reproduce the error, as well as your OS and browser version.
7. Click "Submit new issue".
8. A member of our team should [get back to you](#how-we-review-contributions) shortly with feedback.
9. Enjoy the feeling of a job well done! 🎉

### Pull requests

Sometimes, it's faster to fix a problem yourself than explain it to us. In those cases, rather than create an [issue](#issues), you should make a [pull request](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests).

Pull requests ("PRs" for short) are requests to integrate your changes into a GitHub repository. The simplest way to create a PR on our documentation is by using the **"Edit this page"** link at the bottom left of every page. [See below](#creating-your-first-pr) for more detailed instructions.

Pull requests are particularly good for:

- Fixing a small error, such as a typo, broken link, or bad word choice.
- Making a change that you are particularly qualified for (such as creating a guide for some software that you have mastered).
- **Solving an [existing issue](https://github.com/meilisearch/documentation/issues)**!

Unless your PR is really small, we recommend you first [create an issue](#creating-your-first-issue) to confirm that it's worth your time and that nobody else is working on it already.

#### Creating your first PR

There are many ways to create pull requests, but we'll cover the simplest method for creating a PR on these docs. Feel free to try it on this page!

All you need to continue is a [GitHub account](https://github.com).

1. On the documentation page you'd like to edit, scroll to the bottom and click **"Edit this page"** on the left. This will take you to GitHub.
2. If you're not already signed in, do so now. You may be prompted to create a [fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo)—if so, do it.
3. Use GitHub's text editor to make the change you want.
4. Scroll down to where it says `Propose changes`. In the first text box, write a short description (for example, "Fix typo"). In the second text box, write a longer description of your changes if necessary.
5. Click `Propose changes` to continue. You should see a page that says `Comparing changes`. This screen is prompting you to create a pull request.
6. Make sure the base repository is `meilisearch/documentation` and the base is `main`. Don't worry about the other two boxes—they automatically target the changes you just made.
7. Below, you can see the changes you made compared to the main branch (what's currently published on docs.meilisearch.com). When you're ready, click `Create pull request`.
8. **Congrats, you made your first PR!** Someone from the documentation team will review your pull request shortly. They may ask for changes, so keep an eye on your GitHub notifications.
9. If everything looks good, your work will be merged into the `main` branch and become part of the official documentation site. You are now a Meilisearch Contributor! 🚀

## How we review contributions

For **reviewing issues**, we consider a couple criteria:

1. Is this task a priority for the documentation team?
2. Is our documentation the best place for this information? Sometimes an idea for new content might work better on our blog than the docs, or it might be more effective to link to an external resource than write it ourselves.
3. Can we reproduce this error?

If multiple people create similar issues (or upvote 👍 an issue to show support), that makes us more likely to divert resources towards that task.

For **reviewing contributor PRs**, we start by making sure the PR is up to our **quality standard**.

We ask the following questions:

1. Is the information **accurate**?
2. Is it **easy to understand**? Are explanations and examples clear?
3. Is the English **simple enough to be understood by a non-native speaker**?
4. Is the grammar perfect? Are there any typos?
5. Can it be **more efficient**?
6. Should any new information be added or changed somewhere else in the documentation?
7. In the case of new pages, has the page been added in the right location? Should it be linked elsewhere in the documentation?

Nothing makes us happier than getting a thoughtful, helpful PR that saves us time and effort and makes the documentation **even stronger**. Thank you in advance for your contribution!

Our only major requirement for PR contributions is that the author responds to communication requests within a reasonable timeframe.

Once you've opened a PR on this repo, one of our team members will stop by shortly to review it. If your PR is approved, nothing further is required from you. However, **if in seven days you have not responded to a request for further changes or more information, we will consider the PR abandoned and close it**.

If this happens to you and you think there has been some mistake, please let us know and we will try to rectify the situation.

## Local development

### Requirements

- [Node version](https://nodejs.org/en/) >= v14 and <= v16

### Installing and running the docs

```bash
# Clone the repository
git clone git@github.com:meilisearch/documentation.git meilisearch-documentation

# Open the newly created directory
cd meilisearch-documentation

# Install dependencies
yarn install

# Run Meilisearch documentation on http://localhost:8080
yarn dev
```

### Testing

A complete test can be done using the following command:

```bash
yarn test
```

The tests are triggered on build and on any pull request to main.

#### Checking dead links

Making changes to the documentation without creating any dead links can be a tedious task. Before submitting any pull request, you can check the dead links.

```bash
yarn check-links
```

#### Checking Styling

The documentation follows styling rules. The following files will be checked: `*.vue`, `*.js`, and `*.md`.

You can check out and fix the styling errors.

```bash
yarn style:fix
```

You can test if the code is well-formatted without fixing it.

```bash
yarn style
```

### Handling images and other assets

Screenshots, images, GIFs, and video demonstrations should be placed in a relevant folder under `.vuepress/public/` and then referenced from any markdown file a using relative link. For example, if you create the file `.vuepress/public/my_cool_guide/my_cool_image.png`, you would link to it from your document using 

```md
![A description of my cool image](/my_cool_guide/my_cool_image.png)
```

### Deployment

The documentation is deployed as a static website. The main branch is automatically deployed at [https://docs.meilisearch.com](https://docs.meilisearch.com).

You can build the static website using the following command:

```bash
yarn build
# The website is now available in .vuepress/dist and you can serve it using any webserver.
```
