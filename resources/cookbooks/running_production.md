# Runnning MeiliSearch in production

Running MeiliSearch in production on a distant server is different than running MeiliSearch on your own machine.
This guide aims to drive you through the different steps to have a production-ready MeiliSearch.<br/>
<br/>

For this tutorial, I am using a Debian (9.12) server from Digital Ocean. You can get yours starting from 5$ per month. If you are not already registered on Digital Ocean, you can get 100$ in credit using [our referral link](https://m.do.co/c/7c67bd97e101).

[[TOC]]

## Prerequisites

- A up-to-date server that runs Debian
- An ssh keypair to connect to that machine ([learn how to ssh into your machine](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/))

## Step 1: Install MeiliSearch

There are differents ways to get a running MeiliSearch on your machine. Here we will compile the latest stable release of MeiliSearch from the source to ensure the binary uses your achitecture best.

### a. Install and update system dependencies

First let's ensure that our system and its dependencies are up-to-date and install some dependencies we will need to compile MeiliSearch from source.
```bash
# Update dependencies
$ apt update
# Install git, curl, gcc & make to compile MeiliSearch
$ apt install git curl make gcc
```

### b.Install Rust toolchain

Then, we can install the Rust toolchain. You can find the command line on [the official Rust website](https://www.rust-lang.org/tools/install).
You will be prompted to select how do you want to install Rustup, I suggest you use the default installation.

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# The Rustup toolchain consists of many tools used by developers for the Rust ecosystem. Among them, you can find cargo, the package manager & rustc, the rust compiler.
# Now configure you current shell to have cargo's bin directory into your $PATH
$ source $HOME/.cargo/env
```

### c. Install MeiliSearch

We will compile MeiliSearch from the soure code available on Github.
```bash
$ git clone https://github.com/meilisearch/MeiliSearch && cd MeiliSearch

# We use the latest stable release which you can find on Github:
# https://github.com/meilisearch/MeiliSearch/releases/latest
$ git checkout v0.9.0

# Compile MeiliSearch in release mode
$ cargo build --release
...
Finished release [optimized + debuginfo] target(s) in 11m 41s

# You should now be able to run MeiliSearch
$ ./target/release/meilisearch
...
[2020-04-10T11:29:18Z INFO  tide::server] Server is listening on: http://127.0.0.1:7700

```

## Step 2: Set MeiliSearch as a service

A service is a process that is launched when the operating system is booting.
On Debian, Systemd allows you to create and manage service so you can ensure your MeiliSearch service will always be on when the server is on. If any crash occur during the running of MeiliSearch, systemd automatically restart the service.
We first have to move MeiliSearch binary to
```bash
$ mv target/release/meilisearch /usr/bin/
```

```bash
$ cat << EOF >/etc/systemd/system/meilisearch.service
[Unit]
Description=MeiliSearch
After=systend-user-sessions.service

[Service]
Type=simple
ExecStart=/usr/bin/meilisearch --http-addr 0.0.0.0:7700

[Install]
WantedBy=default.target
EOF
# Set the service meilisearch
$ systemctl enable meilisearch

# Start the meilisearch service
$ systemctl start meilisearch

# Verify that the service is actually running
$ systemtl status meilisearch
● meilisearch.service - MeiliSearch
   Loaded: loaded (/etc/systemd/system/meilisearch.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-04-10 14:27:49 UTC; 1min 8s ago
 Main PID: 14960 (meilisearch)
```


## Step 3: Secure your installation

If you are here, I take it for granted that you are familiar with MeiliSearch and how it works. If this is not the case, I suggest you begin with the Quickstart and then you can have a look at the main guides.

### Where to run MeiliSearch

MeiliSearch is a database, that means that it needs a file system it can write to and which must be persistent.
