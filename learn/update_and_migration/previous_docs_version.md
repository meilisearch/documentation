# Accessing previous documentation versions

Meilisearch's documentation only covers the latest stable release. It is possible, however, to consult the documentation of previous Meilisearch versions stored in our Git repository.

This guide covers downloading Meilisearch's documentation repository, fetching the content for a specific version, and reading it in your local machine.

::: warning
The process of accessing previous versions of Meilisearch's documentation is not user-friendly and significantly error-prone. In the absolute majority of cases, it is better to upgrade to the latest Meilisearch version than to follow this guide.
:::

## Prerequisites

To make the best use of this guide, you should have some familiarity with the command line. Before beginning, you should also make sure the following tools are installed in your machine:

- [Git](https://git-scm.com/)
- [Node v14](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/)
- [Python 3](https://www.python.org)

## Cloning the repository

The first step in accessing previous versions of the Meilisearch documentation is downloading the docs repository into your local machine. In Git, this is often referred to as cloning.

Open your console and run the following command. It will create a `documentation` directory containing the Meilisearch documentation repository:

```sh
git clone https://github.com/meilisearch/documentation.git
```

You may alternatively [clone the repository using an SSH URL](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories#cloning-with-ssh-urls).

## Select a Meilisearch version

The repository contains tags running from Meilisearch v0.8 up to the latest release. Use these tags together with `git checkout` to access a specific version.

The following command fetches Meilisearch v0.20 documentation:

```sh
git checkout v0.20
```

## Access the documentation

Much like the search engine itself, Meilisearch's documentation went through different iterations during its lifetime. There are three ways of accessing the documentation of previous Meilisearch releases depending on the version you checked out.

### Run a local Vuepress server (v0.17 and above)

Meilisearch's documentation was designed to be consulted over a web browser. Running the website locally is the most user-friendly way of accessing docs specific to older versions of Meilisearch.

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
The site search bar and SDK code samples rely on content hosted externally and are not available in local copies of the documentation website.
:::

### Run a simple Python server (v0.11-v0.16)

Accessing the documentation for Meilisearch v0.11 up to and including v0.16 requires launching a Python HTTP server on your local machine. Run the following command on your console:

```sh
python3 -m http.server 8080
```

Once this is done, use your browser to navigate to `http://localhost:8080`.

### Navigate markdown source files (v0.10 and below)

Due to an unconsolidated build workflow on early documentation website versions, it can be challenging to manage deprecated tools and antiquated libraries. When accessing documentation for Meilisearch v0.10 and earlier, it is often more efficient to browse the documentation source with the help of a modern text editor.
