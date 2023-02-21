# Supported operating systems

This page lists operating systems Meilisearch officially supports and tests with every new release. Meilisearch binaries might still run in unsupported environments. Refer to the [changelog](https://github.com/meilisearch/MeiliSearch/releases) for more information on operating system support changes.

If the provided [binaries](/learn/getting_started/installation.md#local-installation) don't work for you, try building Meilisearch from source. If compilation fails, Meilisearch is not compatible with your machine.

## Linux

The Meilisearch binary works on all Linux distributions with `amd64/x86_64` or `aarch64/arm64` architecture using glibc 2.27 and later. You can check your glibc version using:

```
ldd --version
```

## macOS

The Meilisearch binary works with macOS 12 and later with `amd64` or `arm64` architecture.

## Windows

Meilisearch binary works on Windows server 2022 and later.

Meilisearch test suite indeed runs on Windows server 2022, so we also expect Meilisearch binary to work on Windows OS 10 and later. However, you have to know Windows servers and Windows OS can be sometimes different on some points, so we cannot guarantee 100% of compatibilty for Windows OS.
