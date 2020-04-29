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

MeiliSearch is finally compiled and ready to use. If you want to make it accessible from anywhere in your system, you should move this binary into your system binaries folder, with the following command:  

```bash
# Move the MeiliSearch binary to your system binaries
$ mv target/release/meilisearch /usr/bin/
```

## Step 2: Run MeiliSearch as a service

In Linux environments, a `service` is a process that can be launched when the operating system is booting, and keeps running in the background. One of its biggest advantages is that it can make your program available at any moment, in a stable and consistent way. 

This means that the operating system will make sure that your program is running at any time. Even if it finds some execution problem or crashes, this service will be restarted and your program will be run again.  

> This is not required, but if you are new to services and systemd, you can learn the [basics of Linux services](https://www.hostinger.com/tutorials/manage-and-list-services-in-linux/)  

On Debian (and Linux distributions in general), systemd allows you to create and manage your own custom services. We want to make sure that MeiliSearch is always responding to your requests, so let's build our own service. This way, we will make sure that your MeiliSearch service will always be available and running when the server is on. If any crash occurs during the running of MeiliSearch, systemd automatically restart it for you.  

### 2.1 Create a service file

Service files are text files that tell your operating system how to run your program, and when. They live in the `/etc/systemd/system` directory, and your system will load them when it boots. In this case we will use a very simple service file that will run MeiliSearch at the port `7700`.  

> For more information on MeiliSearch options and flags see the [installation docs](https://docs.meilisearch.com/guides/advanced_guides/installation.html#download-and-launch)  

We are also using the `--env` flag to run MeiliSearch in a production environment, and `--master-key` to have a key that will let MeiliSearch create reading and writing keys to control who can access or create new documents, indexes, or change the configuration. You can change this `Master Key` to any value you want, but you should choose a safe and random key for security purposes, never share it and, just, keep it safe.  

> For more information on MeiliSearch authentication and API keys see the [Authentication docs](https://docs.meilisearch.com/guides/advanced_guides/authentication.html)  

```bash
$ cat << EOF >/etc/systemd/system/meilisearch.service
[Unit]
Description=MeiliSearch
After=systend-user-sessions.service

[Service]
Type=simple
ExecStart=/usr/bin/meilisearch --http-addr 127.0.0.1:7700 --env production --master-key Y0urVery-S3cureAp1K3y

[Install]
WantedBy=default.target
EOF

```

We don't want to expose your MeiliSearch to the external world (we will use a proxy server in the next steps) so we will make it available only locally, by telling him to run in the local backloop IP adress `127.0.0.1`. This means that only programs running in your machine ar allowed to make requests to your MeiliSearch instance.

### 2.2. Enable and start service

The service file we just built is all we need for creating our service. Now we must `enable` the service to tell the operating system that we want him to run MeiliSearch at every boot. We can finally `start` the service to make it run inmediately. We can check everything is working by checking the service `status`.

```bash
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

MeiliSearch is installed and running. It is protected from eventual crashes, system restarts, and most of the problems it could find while running. But it is still hidden and protected inside the walls (or firewalls) of your machine, and unreachable from the outside world. You can stop here if all the requests you do to MeiliSearch are done by another application living in the same machine.

But you probably want to open your MeiliSearch to the outside world, and for now, it is isolated. Let's fix that in a safe way.

## Step 3: Secure your installation. Using a Reverse Proxy and SSL

Now, we want to make our brand new MeiliSearch available to be requested from the outside world. But we want to do it safely. For this purpose we are going to use two of the main technologies available on the web: a Reverse Proxy and SSL

### 3.1. Creating a Reverse Proxy with Nginx

A reverse proxy is basically a server that will handle communcations betweent the outside world and your internal applications. 

### 3.2. Activating SSL (HTTPS) on your MeiliSearch

### Where to run MeiliSearch

MeiliSearch is a database, that means that it needs a file system it can write to and which must be persistent.
