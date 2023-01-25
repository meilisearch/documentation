# Consulting documentation of previous versions

This site reflects Meilisearch's latest stable release. It is possible, however, to consult the documentation of previous Meilisearch versions stored in our Git repository.

This guide covers downloading Meilisearch's documentation repository, checking out a specific documentation version, installing its dependencies, and accessing your local copy.

## Dependencies and prerequisites

To make the best use of this guide, you should have some familiarity with the command line. Before beginning, you should also make sure the following tools are installed in your machine:

- Git
- Node v0.14
- NVM
- Yarn

## Cloning the repository

The first step in accessing previous versions of the Meilisearch documentation is downloading the docs repository into your local machine. In Git, this is often referred to as cloning. 

Open your console and run the following command. It will create a `documentation` directory containing the Meilisearch documentation repository:

```sh
git clone https://github.com/meilisearch/documentation.git
```

You may alternatively clone the repository using SSH, `github-cli`, or a Github GUI.

## Select a Meilisearch version

The repository contains tags running from Meilisearch v0.8 up to the latest release. Use these tags together with `git checkout` to access a specific version.

The following command fetches Meilisearch v0.20 documentation:

```sh
git checkout v0.20
```

## Access the documentation

There are two ways of accessing older versions of the Meilisearch documentation: directly browsing the source markdown files, or building and running a local copy of the website.

### Run a local copy of the documentation website (recommended for v0.17 and above)

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

### Navigate markdown source files (recommended for v0.16 and below)

Due to an unconsolidated build workflow on early documentation website versions, it can be challenging to manage deprecated tools and antiquated libraries. In these cases, it is often more efficient to browse the documentation source with the help of a modern text editor.
