# Run MeiliSearch in production: taking it to the next level

## A quick introduction

Hopefully, you already know that [MeiliSearch](https://github.com/meilisearch/MeiliSearch) is a powerful and fast open-source search engine built in [Rust](https://www.rust-lang.org). It was designed to provide users with a very useful and customizable search experience including out-of-the-box features such as typo-tolerance, filtering, and synonyms for any kind of project.

Running a MeiliSearch instance for testing purposes is incredibly easy and can be done in [many ways](/learn/getting_started/quick_start.md): using Docker, Homebrew, Aptitude, binaries, a simple `curl`, or even the source code. If you are new to MeiliSearch, we suggest that you take a tour around the documentation.

Using MeiliSearch on your own machine for your weekend project is fun, let's agree on that. However, you may want to go live and deploy a project in production, to take it to the next level. What steps and details would you need to **deploy MeiliSearch in production** and ensure it is **safe and ready to use**?

## Content of this article

[Step 1: Install MeiliSearch](/create/how_to/running_production.md#step-1-install-meilisearch)

[Step 2: Run MeiliSearch as a service](/create/how_to/running_production.md#step-2-run-meilisearch-as-a-service)

+ [2.1. Create a service file](/create/how_to/running_production.md#_2-1-create-a-service-file)
+ [2.2. Enable and start service](/create/how_to/running_production.md#_2-2-enable-and-start-service)

[Step 3: Secure and finish your setup. Using a reverse proxy, domain name and HTTPS](/create/how_to/running_production.md#step-3-secure-and-finish-your-setup-using-a-reverse-proxy-domain-name-and-https)

+ [3.1. Creating a reverse proxy with Nginx](/create/how_to/running_production.md#_3-1-creating-a-reverse-proxy-with-nginx)
+ [3.2. Set up SSL/TLS for your MeiliSearch](/create/how_to/running_production.md#_3-2-set-up-ssl-tls-for-your-meilisearch)

[Conclusion](/create/how_to/running_production.md#conclusion)

## Get your MeiliSearch ready for production

For this tutorial, we will be using a Debian 10 server, running on DigitalOcean. You can easily try it on your own, with plans starting at $5/month. And if you want some credits to start running your MeiliSearch and are not already registered on DigitalOcean, you can get $100 for free using [this referral link](https://m.do.co/c/7c67bd97e101).

## Prerequisites

+ An up-to-date server that runs Debian 10
+ An ssh keypair to connect to that machine

::: tip
Learn how to connect via SSH to your [DigitalOcean droplet](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/) or any [Linux or windows server](https://phoenixnap.com/kb/ssh-to-connect-to-remote-server-linux-or-windows)
:::

## Step 1: Install MeiliSearch

Installing and running MeiliSearch is easy and straightforward. In order to keep this tutorial as simple as possible, let's use a script that will carry out the installation process. It will copy a binary of MeiliSearch to your machine and enable you to use it immediately.

Once you are logged in into your machine via SSH, ensure your system and its dependencies are up-to-date before proceeding with the installation.

```bash
# Update the list of available packages and their versions
apt update
# Install curl which is required to install MeiliSearch in the next step
apt install curl -y
# Install MeiliSearch latest version from the script
curl -L https://install.meilisearch.com | sh
```

The different MeiliSearch installation options are detailed in [this guide](/learn/getting_started/installation.md#download-and-launch).

**There are many different ways to get MeiliSearch running on your machine.** As an open-source project, you can always compile the latest stable release of MeiliSearch from its source code to ensure the binary uses your architecture in the best possible way.

You can always check the latest MeiliSearch stable version, and get MeiliSearch for the Operating System of your choice, by visiting the following link:

**[Latest MeiliSearch Stable Version](https://github.com/meilisearch/MeiliSearch/releases/latest)**

MeiliSearch is finally installed and ready to use. To make it accessible from everywhere in your system, move the binary file into your system binaries folder:

```bash
# Move the MeiliSearch binary to your system binaries
mv ./meilisearch /usr/bin/
```

You can now start using MeiliSearch! In your terminal, run the following command to launch meilisearch.

```bash
meilisearch
```

You should see the following successful response:

```
888b     d888          d8b 888 d8b  .d8888b.                                    888
8888b   d8888          Y8P 888 Y8P d88P  Y88b                                   888
88888b.d88888              888     Y88b.                                        888
888Y88888P888  .d88b.  888 888 888  "Y888b.    .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888     "Y88b. d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888       "888 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888 Y88b  d88P Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  "Y8888P"   "Y8888  "Y888888 888     "Y8888P 888  888

Database path: "./data.ms"
Server listening on: "127.0.0.1:7700"
```

## Step 2: Run MeiliSearch as a service

In Linux environments, a `service` is a process that can be launched when the operating system is booting and which will keep running in the background. One of its biggest advantages is making your program available at any moment. Even if some execution problems or crashes occur, the service will be restarted and your program will be run again.

::: note
If you are new to services and `systemd`, you can learn more about the basics of Linux services [here](https://www.hostinger.com/tutorials/manage-and-list-services-in-linux/).
:::

In Debian and other Linux distributions, `systemd` allows you to create and manage your own custom services. In order to make sure that MeiliSearch will always respond to your requests, you can build your own service. This way, you will ensure its availability in case of a crash or in case of system reboot. If any of these occur, `systemd` will automatically restart MeiliSearch.

### 2.1 Create a service file

Service files are text files that tell your operating system how to run your program, and when. They live in the `/etc/systemd/system` directory, and your system will load them at boot time. In this case, let's use a very simple service file that will run MeiliSearch on port `7700`.

To run MeiliSearch in a production environment, use the `--env` flag. To generate a master key that will let MeiliSearch create reading and writing keys, use the `--master-key` flag. With those keys, you can easily control who can access or create new documents, indexes, or change the configuration. You can change the `Master Key` to any value in the following command. However, for security concerns, it's better to choose a safe and random key, never share it and, just, **keep it safe**.

```bash
cat << EOF > /etc/systemd/system/meilisearch.service
[Unit]
Description=MeiliSearch
After=systemd-user-sessions.service

[Service]
Type=simple
ExecStart=/usr/bin/meilisearch --http-addr 127.0.0.1:7700 --env production --master-key Y0urVery-S3cureAp1K3y

[Install]
WantedBy=default.target
EOF
```

::: tip
For more information on MeiliSearch authentication and API keys see the [authentication docs](/reference/features/security.md). For more information on MeiliSearch options and flags see the [installation docs](/learn/getting_started/installation.md#download-and-launch).
:::

As for now, it is not time yet to expose your MeiliSearch instance to the external world. To keep running it safely inside your own environment, make it available locally at `127.0.0.1`. This means that only programs running on your machine are allowed to make requests to your MeiliSearch instance.

### 2.2. Enable and start service

The service file you just built is all you need for creating your service. Now you must `enable` it to tell the operating system that we want it to run MeiliSearch at every boot. You can then `start` the service to make it run immediately. Ensure everything is working smoothly by checking the service `status`.

```bash
# Set the service meilisearch
systemctl enable meilisearch

# Start the meilisearch service
systemctl start meilisearch

# Verify that the service is actually running
systemctl status meilisearch
```

```bash
-# --- Expected output ---
● meilisearch.service - MeiliSearch
   Loaded: loaded (/etc/systemd/system/meilisearch.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-04-10 14:27:49 UTC; 1min 8s ago
 Main PID: 14960 (meilisearch)
```

At this point, MeiliSearch is installed and running. It is protected from eventual crashes, system restarts, and most of the problems it could find while running. But it is still hidden and protected inside the walls (or firewalls) of your machine, and unreachable from the outside world. You can stop here if all the requests you do to MeiliSearch are done by another application living in the same machine.

But you probably want to open your MeiliSearch to the outside world, and for now, it is isolated. Let's fix that in a safe way.

## Step 3: Secure and finish your setup using a reverse proxy, domain name, and HTTPS

It's time to safely make your brand new MeiliSearch available to be requested from the outside world. For this purpose, you will use two of the main technologies available on the web: a Reverse Proxy and SSL/TLS.

### 3.1. Creating a reverse proxy with [Nginx](https://www.nginx.com/)

A reverse proxy is basically an application that will handle every communication between the outside world and your internal applications. Nginx will receive external HTTP requests and redirect them to MeiliSearch. When MeiliSearch has done its amazing job, it will communicate its response to Nginx, which will then transfer the latter to the user who originally sent the request. This is a common way to isolate and protect any application by adding a robust, secure, and fast gate-keeper such as Nginx, one of the safest and most efficient tools available online, and of course, open-source!

::: tip
Reverse proxies are very useful regarding security, performance, scalability, and logging concerns. If you are new to Reverse proxies, you may enjoy this article explaining the why and the how of [reverse proxies](https://www.keycdn.com/support/nginx-reverse-proxy).
:::

Configuring Nginx as a proxy server is really simple. First of all, install it on your machine.

```bash
# Install Nginx on Debian
apt-get install nginx -y
```

First, deleting the default configuration file is important as the default port for HTTP, the `port 80`, is used by Nginx by default. Thus, trying to use it for MeiliSearch will create a conflict. Replace the default file by your own configuration file. You can also make MeiliSearch listen to another port by specifying it in the Nginx configuration file, but we will not cover this option in this tutorial.

```bash
# Delete the default configuration file for Nginx
rm -f /etc/nginx/sites-enabled/default

# Add your configuration file specifying the Reverse Proxy settings
cat << EOF > /etc/nginx/sites-enabled/meilisearch
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    location / {
        proxy_pass  http://127.0.0.1:7700;
    }
}
EOF
```

Finally, enable and start the Nginx service again to make sure it is still available.

```bash
# Reload the operating system daemons / services
systemctl daemon-reload

# Enable and start Nginx service
systemctl enable nginx
systemctl restart nginx
```

MeiliSearch is now up, deployed in a production environment, using a safe API key, and being served by a Reverse Proxy Nginx. You should now be able to send requests to your server from the outside world. Open your web browser and visit: (<http://your-ip-address>). The IP address is the same you used to connect to your machine via SSH in Step 1.

::: note
If you want to learn more about using Nginx as a Reverse Proxy, see [this dedicated documentation](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).
:::

The only remaining problem is that MeiliSearch processes requests via HTTP without any additional security. The content that is being transmitted over HTTP could easily be read or modified by attackers, and someone could get full or partial access to your data. In order to prevent this to happen, it's important to use the HTTPS, which will enable you to use a SSL/TLS certificate, and securely transmit data.

### 3.2. Set up SSL/TLS for your MeiliSearch

SSL will let the user or client establish an authenticated connection to MeiliSearch. In this way, a user can verify server's identity before sending sensitive data or making any request to it. Then, data is sent in an encrypted way that only MeiliSearch server will be able to decrypt, providing you a fast, reliable, and automatic layer of security.

In most cases, when enabling SSL, you may want to use your own domain name (or a sub-domain). The first step you need to follow is to register your own domain name and change the DNS records. To make your domain name point to your newly installed MeiliSearch server, you just need to add an `A record` pointing to the IP address used to connect to your own server. This process is simple and fast but can vary for every domain name provider. Thus, we will not cover that process in this article.

::: tip
When you register a domain name and add an `A record`, you should be automatically able to request MeiliSearch directly by using that domain name.
To illustrate this, if you had registered your domain name `example.com`, requesting indexes would be done at <http://example.com/indexes>
:::

Once your domain name has been set up, you are ready to configure SSL/TLS and use HTTPS. You have two different options to achieve this goal. The first one is using [Certbot](https://certbot.eff.org/), an amazing, free, and very easy to use tool. If you already have SSL certificates issued from a `Certificate Authority or CA` for your domain name, the second option covers the steps you need to follow. Then, you will be ready to use MeiliSearch safely in production!

#### 3.2. Option A: Certbot

Using certbot in your Linux server is very easy and straightforward. This tool will generate a free SSL/TLS certificate for your domain name, and automatically handle its installation on your server. The certbot documentation contains detailed instructions for many operating systems and servers, but we will follow the instructions for [Certbot on Debian with Nginx](https://certbot.eff.org/lets-encrypt/debianbuster-nginx).

First of all, install the packages on your system:

```bash
sudo apt-get install certbot python-certbot-nginx -y
```

Let's run the Certbot script to be guided through the installation process:

```bash
certbot --nginx
```

Enter your email address, agree to the Terms and Conditions, and input your domain name. You will then be prompted with these options:

```bash
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
```

We recommend that you choose option 2, to redirect HTTP to HTTPS and always use a secure connection. You should be able to request your domain name with SSL as in `https://example.com` or `https://example.com/indexes`.

#### 3.2. Option B: Custom SSL/TLS certificates

When a `Certificate Authority` issues a SSL certificate for you, you receive at least two files with encrypted keys:

+ Your **certificate** (commonly named `your_domain_name.pem` or `example.pem`)
+ Your **key** (commonly named `your_domain_name.key` or `example.key`)

`example.pem` and `example.key` will be used in the following examples. Make sure to replace `example` by the names of your own certificate files.

All you need to do is store the certificate files in a secure location and use appropriate file system security permissions. Then, set the location of the certificates in Nginx configuration. It is also strongly recommended to redirect all HTTP requests to HTTPS (port 80 to 443).

First, let's copy your certificate files in their conventional directory so the server can find them:

```bash
# Create a directory /etc/ssl/example to store the certificate files
mkdir -p /etc/ssl/example

# Move your files to /etc/ssl/example. We will suppose that your
# files are called example.pem and example.key

mv path-to-your-files/example.pem /etc/ssl/example/
mv path-to-your-files/example.key /etc/ssl/example/
```

Finally, we create a new Nginx configuration file, and restart the daemons and Nginx service

Remember to replace `example.com` in both `server_name` fields with your **own domain name**

```bash

# Replace example.com in both `server_name` fields with your own domain name

cat << EOF > /etc/nginx/sites-enabled/meilisearch
server {
      listen 80 default_server;
      listen [::]:80 default_server;

      server_name example.com;

      return 301 https://\$server_name\$request_uri;
}
server {
    server_name example.com;

    location / {
        proxy_pass  http://127.0.0.1:7700;
    }

    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;

    access_log /var/log/nginx/nginx.vhost.access.log;
    error_log /var/log/nginx/nginx.vhost.error.log;
    ssl_certificate /etc/ssl/example/example.pem;
    ssl_certificate_key /etc/ssl/example/example.key;
}
EOF

systemctl restart nginx
```

Your SSL certificates should be working and Nginx should be able to find them. Every request to `http://example.com` will now be redirected to `https://example.com`

## Conclusion

You have followed the main steps to provide a safe and stable service. Your MeiliSearch instance should be up and running, in a safe environment and ready to stay available even when the most common issues occur. In addition, it is protected by a reverse proxy with your own domain name and API key, so your data and configuration are accessible only to trusted clients. Communication with your server is now encrypted. Furthermore, its identity will be verified every time before sending sensitive data in a fast and automated manner.

You are now ready to start using your **production-ready MeiliSearch instance**!
