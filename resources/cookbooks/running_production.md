# MeiliSearch in production: taking it to the next level
  
## A quick introduction
  
As you hopefully know already, [MeiliSearch](https://github.com/meilisearch/MeiliSearch) is a powerfull and fast search engine built in [Rust](https://www.rust-lang.org) as an Open Source tool. It was designed to provide users with very useful and customizable search experience including features like typo-tolerance, filtering or synonyms out of the box. Running a Meilisearch for testing purposes is incredibly easy, as [many alternatives](https://docs.meilisearch.com/guides/introduction/quick_start_guide.html) are porposed: Docker, brew, aptitude, binaries, a simple curl or even the source code. If you are new to MeiliSearch, we suggest that you make a tour arround our [Documentation](https://docs.meilisearch.com/)
  
  
Running a Meilisearch in your own machine for your weekend project is fun, let's agree on that. But we are here to **take you to the next step**. You probably want to go live, and deploy a project in production, take it to the real word. What are the steps and details you need to **deploy a MeiliSearch in production** and being sure that it is **safe and ready to use**?
  
  
[[TOC]]
  
  
## Get your MeiliSearch ready for production
  
For this tutorial, we will be using a Debian 10 server, running on Digital Ocean. You can easily try it on your own, with plans starting at $5/month. And if you want some credits to start running your MeiliSearch and are not already registered on Digital Ocean, you can get $100 for free using [this referral link](https://m.do.co/c/7c67bd97e101).



## Prerequisites

- An up-to-date server that runs Debian 10
- An ssh keypair to connect to that machine

> *TIPS:* learn how to connect via SSH to your [DigitalOcean droplet](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/) or any [Linux or windows server](https://phoenixnap.com/kb/ssh-to-connect-to-remote-server-linux-or-windows)

## Step 1: Install MeiliSearch

There are different ways to get a running MeiliSearch on your Debian machine. For this example, we will compile the latest stable release of MeiliSearch from the source to ensure the binary uses your achitecture in the best possible way.

### 1.1. Install and update the system dependencies

First let's ensure that our system and its dependencies are up-to-date and install some dependencies we will need to compile MeiliSearch from source.
```bash
# Update references to the dependencies on Debian
$ apt update
# Install git, curl, gcc & make to compile MeiliSearch
$ apt install git curl make gcc
```

### 1.2. Install the Rust toolchain

Then, we can install the Rust toolchain. You can find the command line on [the official Rust website](https://www.rust-lang.org/tools/install).
You will be prompted to select how do you want to install Rustup, we suggest you use the default installation.

```bash
# The Rustup toolchain consists of many tools used by developers for the Rust ecosystem. Among them, you can find cargo, the package manager & rustc, the rust compiler.
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# Now configure you current shell to have cargo's bin directory into your $PATH
$ source $HOME/.cargo/env
```

### 1.3. Install MeiliSearch

We will compile MeiliSearch from the source code available on Github. We suggest you use the latest stable version wich can be found here:

[Latest MeiliSearch Stable Version](https://github.com/meilisearch/MeiliSearch/releases/latest)

> At the time this article was written, latest stable version is v0.10.1

```bash
# Get a fresh copy of MeiliSearch source code
$ git clone https://github.com/meilisearch/MeiliSearch && cd MeiliSearch

# v0.10.1 can be replaced by the latest stable version
$ git checkout v0.10.1

# Compile MeiliSearch in release mode
$ cargo build --release

# You should now be able to run MeiliSearch
$ ./target/release/meilisearch

# --- Expected output ---

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
