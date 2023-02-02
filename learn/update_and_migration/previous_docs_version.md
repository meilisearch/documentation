# Accessing previous docs versions

This documentation website only covers the latest stable release of Meilisearch. However, it is possible to view the documentation of previous Meilisearch versions stored in [our GitHub repository](https://github.com/meilisearch/documentation).

This guide shows you how to clone Meilisearch's documentation repository, fetch the content for a specific version, and read it in your local machine.

::: warning
While we provide this guide to help users of old versions accomplish their bare minimum needs, it is not intended as a long-term solution or to encourage users to continue using outdated versions of Meilisearch. In almost every case, **it is better to upgrade to the latest Meilisearch version**.

Depending on the version in question, the process of accessing old documentation may be difficult or error-prone. You have been warned!
:::

## Prerequisites

To follow this guide, you should have some familiarity with the command line. Before beginning, make sure the following tools are installed in your machine:

- [Git](https://git-scm.com/)
- [Node v14](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/)
- [Python 3](https://www.python.org)

## Clone the repository

To access previous versions of the Meilisearch documentation, the first step is downloading the documentation repository into your local machine. In Git, this is referred to as cloning.

Open your console and run the following command. It will create a `documentation` directory in your current location containing the Meilisearch documentation site project files:

```sh
git clone https://github.com/meilisearch/documentation.git
```

Alternatively, you may [clone the repository using an SSH URL](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-ssh-urls).

## Select a Meilisearch version

The documentation repository contains tags for versions from `v0.8` up to the latest release. Use these tags together with `git checkout` to access a specific version.

For example, the following command retrieves the Meilisearch v0.20 documentation:

```sh
git checkout v0.20
```

[View all documentation tags.](https://github.com/meilisearch/documentation/tags)

## Access the documentation

There are three different ways of accessing the documentation of previous Meilisearch releases depending on the version you checked out.

### v0.17 and above: run a local Vuepress server


#### Install dependencies

The Meilisearch documentation manages its dependencies with Yarn. Run the following command to install all required packages:

```sh
yarn install
```

#### Start the local server

After installing dependencies, use yarn to start the server:

```sh
yarn dev
```

Yarn will build the website from the markdown source files. Once it is done, use your browser to navigate to `http://localhost:8080`.

::: warning
The site search bar and SDK code samples are not available in local copies of the documentation website.
:::

### v0.11-v0.16: run a simple Python server

Accessing Meilisearch documentation from v0.11 to v0.16 requires launching a Python HTTP server on your local machine. Run the following command on your console:

```sh
python3 -m http.server 8080
```

Once this is done, use your browser to navigate to `http://localhost:8080`.

### v0.8 to v0.10: read markdown source files

Due to an unconsolidated build workflow on early versions of the documentation website involving multiple deprecated tools and libraries, we recommend browsing the source markdown files, either locally with the help of a modern text editor or using GitHub's interface.
