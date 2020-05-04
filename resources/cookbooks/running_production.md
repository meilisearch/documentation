# MeiliSearch in production: taking it to the next level
  
## A quick introduction
  
Hopefully, you already know that [MeiliSearch](https://github.com/meilisearch/MeiliSearch) is a powerful and fast search engine built in [Rust](https://www.rust-lang.org) as an Open Source tool. It was designed to provide users with a very useful and customizable search experience including features like typo-tolerance, filtering and synonyms out of the box, for any kind of project. Running a Meilisearch for testing purposes is incredibly easy, as [many alternatives](https://docs.meilisearch.com/guides/introduction/quick_start_guide.html) are available: Docker, brew, aptitude, binaries, a simple curl or even the source code. If you are new to MeiliSearch, we suggest that you make a tour arround our [Documentation](https://docs.meilisearch.com/)  
  
  
Running MeiliSearch on your own machine for your weekend project is fun, let's agree on that. But we are here to **take you to the next step**. You probably want to go live, and deploy a project in production, take it to the real word. What are the steps and details you need to **deploy MeiliSearch in production** and be sure that it is **safe and ready to use**?  

## Content of this article

[Step 1: Install MeiliSearch](#Step-1-Install-MeiliSearch)

[Step 2: Run MeiliSearch as a service](#Step-2-Run-MeiliSearch-as-a-service)
+ [2.1 Create a service file](#21-Create-a-service-file)
+ [2.2. Enable and start service](#22-Enable-and-start-service)

[Step 3: Secure and finish your setup. Using a Reverse Proxy, domain name and HTTPS](#Step-3-Secure-and-finish-your-setup-Using-a-Reverse-Proxy-domain-name-and-HTTPS)
+ [3.1. Creating a Reverse Proxy with Nginx](#31-Creating-a-Reverse-Proxy-with-Nginx)
+ [3.2. Activating SSL (HTTPS) on your MeiliSearch](#32-Activating-SSL-HTTPS-on-your-MeiliSearch)

[Conclusion](#Conclusion)
  
## Get your MeiliSearch ready for production
  
For this tutorial, we will be using a Debian 10 server, running on DigitalOcean. You can easily try it on your own, with plans starting at $5/month. And if you want some credits to start running your MeiliSearch and are not already registered on DigitalOcean, you can get $100 for free using [this referral link](https://m.do.co/c/7c67bd97e101).  



## Prerequisites

- An up-to-date server that runs Debian 10
- An ssh keypair to connect to that machine

> *TIPS:* learn how to connect via SSH to your [DigitalOcean droplet](https://www.digitalocean.com/docs/droplets/how-to/connect-with-ssh/) or any [Linux or windows server](https://phoenixnap.com/kb/ssh-to-connect-to-remote-server-linux-or-windows)

## Step 1: Install MeiliSearch

Installing and running MeiliSearch is an easy and straightforward process. In order to keep this tutorial as simple as possible, we are going to use a MeiliSearch installation script that will take care of the process for you. It will get a copy of a MeiliSearch binary in your machine and let you use it inmediatley.

Once we are logged in into our machine via SSH, we only need to be sure that our system and its dependencies are up-to-date and install MeiliSearch.
```bash
# Update references to the dependencies on Debian
$ apt update
# Install curl, that we need to install MeiliSearch in the next step
$ apt install curl -y
# Install MeiliSearch latest version from the script
$ curl -L https://install.meilisearch.com | sh
```

> The diferent options to achieve a MeiliSearch install are detailed in our **[Installation Docs](https://docs.meilisearch.com/guides/advanced_guides/installation.html#download-and-launch)**

> It is important to know that there are different ways to get MeiliSearch running on your machine. As an open source project, you can always compile the latest stable release of MeiliSearch from the source code to ensure the binary uses your achitecture in the best possible way.  

You can always check the latest MeiliSearch stable version, and get MeiliSearch for the Operating System of your choice, by visiting the following link:  

**[Latest MeiliSearch Stable Version](https://github.com/meilisearch/MeiliSearch/releases/latest)**  

MeiliSearch is finally installed and ready to use. If you want to make it accessible from everywhere in your system, you should move this binary into your system binaries folder, with the following command:  

```bash
# Move the MeiliSearch binary to your system binaries
$ mv ./meilisearch /usr/bin/
```

Now you can test your new installation by running `meilisearch` as a command in your terminal (use ctrl-c or command-c to stop execution):

```bash
$ meilisearch

# --- Expected output for v0.10.1 ---
888b     d888          d8b 888 d8b  .d8888b.                                    888
8888b   d8888          Y8P 888 Y8P d88P  Y88b                                   888
88888b.d88888              888     Y88b.                                        888
888Y88888P888  .d88b.  888 888 888  "Y888b.    .d88b.   8888b.  888d888 .d8888b 88888b.
888 Y888P 888 d8P  Y8b 888 888 888     "Y88b. d8P  Y8b     "88b 888P"  d88P"    888 "88b
888  Y8P  888 88888888 888 888 888       "888 88888888 .d888888 888    888      888  888
888   "   888 Y8b.     888 888 888 Y88b  d88P Y8b.     888  888 888    Y88b.    888  888
888       888  "Y8888  888 888 888  "Y8888P"   "Y8888  "Y888888 888     "Y8888P 888  888

[2020-05-04T11:47:13Z INFO  meilisearch] Database path: "./data.ms"
[2020-05-04T11:47:13Z INFO  meilisearch] Start server on: "127.0.0.1:7700"
```

## Step 2: Run MeiliSearch as a service

In Linux environments, a `service` is a process that can be launched when the operating system is booting, and it will keep running in the background. One of its biggest advantages is that it can make your program available at any moment, in a stable and consistent way. Even if it finds some execution problem or crashes, the service will be restarted and your program will be run again.  

> This is not required, but if you are new to services and systemd, you can learn the [basics of Linux services](https://www.hostinger.com/tutorials/manage-and-list-services-in-linux/) here.  

On Debian (and Linux distributions in general), `systemd` allows you to create and manage your own custom services. We want to make sure that MeiliSearch is always responding to your requests. And for that, we are going to build our own service. This way, we will make sure that your MeiliSearch service will always be available and running when the server is on. If any crash occurs during the running of MeiliSearch, or the system reboots for any reason, systemd automatically restarts MeiliSearch for you.  

### 2.1 Create a service file

Service files are text files that tell your operating system how to run your program, and when. They live in the `/etc/systemd/system` directory, and your system will load them when it boots. In this case we will use a very simple service file that will run MeiliSearch at the port `7700`.  

We are also using the `--env` flag to run MeiliSearch in a production environment, and `--master-key` to have a key that will let MeiliSearch create reading and writing keys. With this generated keys, you can easily control who can access or create new documents, indexes, or change the configuration. You can change this `Master Key` to any value you want in the following command, but you should choose a safe and random key for security purposes, never share it and, just, **keep it safe**.

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

> For more information on MeiliSearch authentication and API keys see the **[Authentication Docs](https://docs.meilisearch.com/guides/advanced_guides/authentication.html)**. For more information on MeiliSearch options and flags see the **[Installation Docs](https://docs.meilisearch.com/guides/advanced_guides/installation.html#download-and-launch)**  

As for now, we don't want to expose your MeiliSearch to the external world. We want it to run safely inside your own environment. So we will make it available only locally, by telling it to be available in the local backloop IP adress `127.0.0.1`. This means that only programs running on your machine are allowed to make requests to your MeiliSearch instance. We will use a proxy server in step 3 to make it available to the outside world.

### 2.2. Enable and start service

The service file we just built is all we need for creating our service. Now we must `enable` the service to tell the operating system that we want it to run MeiliSearch at every boot. We can finally `start` the service to make it run inmediately. We can check everything is working smoothly by checking the service `status`.

```bash
# Set the service meilisearch
$ systemctl enable meilisearch

# Start the meilisearch service
$ systemctl start meilisearch

# Verify that the service is actually running
$ systemctl status meilisearch

-# --- Expected output ---
● meilisearch.service - MeiliSearch
   Loaded: loaded (/etc/systemd/system/meilisearch.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-04-10 14:27:49 UTC; 1min 8s ago
 Main PID: 14960 (meilisearch)
```

At this point, MeiliSearch is installed and running. It is protected from eventual crashes, system restarts, and most of the problems it could find while running. But it is still hidden and protected inside the walls (or firewalls) of your machine, and unreachable from the outside world. You can stop here if all the requests you do to MeiliSearch are done by another application living in the same machine.

But you probably want to open your MeiliSearch to the outside world, and for now, it is isolated. Let's fix that in a safe way.

## Step 3: Secure and finish your setup. Using a Reverse Proxy, domain name and HTTPS

Now, we want to make our brand new MeiliSearch available to be requested from the outside world. But we want to do it safely. For this purpose we are going to use two of the main technologies available on the web: a Reverse Proxy and SSL

### 3.1. Creating a Reverse Proxy with [Nginx](https://www.nginx.com/)

A reverse proxy is basically an application that will handle every communcation between the outside world and your internal applications. In our case, we want to use Nginx to recieve the HTTP requests coming from the outside world, and redirect them to MeiliSearch itself, but internally. When MeiliSearch has done its amazing job, it will communicate its response to Nginx, which will then transfer this response to the user who sent the request. This is a common way to isolate and protect any application by adding a gate-keeper as robust, secure and fast as Nginx, one of the most safe and efficient tools available online, and of course, Open Source!  

> Reverse proxies are very useful for security, performance, scalability and logging reasons. If you are new to Reverse proxies, you may enjoy this article explaining the why and the how of [reverse proxies](https://www.keycdn.com/support/nginx-reverse-proxy)  

Making Nginx work as a proxy server is really simple. First of all we need to install it in our machine.

```bash
# Install Nginx on Debian
$ apt-get install nginx -y
```

Now we need to delete its default configuration file in order to add our own. This is important because the default port for HTTP, the `port 80` is used by nginx by default and if we try to use it for MeiliSearch we will create a conflict. We will replace its default file by our own. You can also make MeiliSearch listen to another port by specifying it in the nginx configuration file, but we will not cover this option in this article.

```bash
# Delete the default configuration file for Nginx
$ rm -f /etc/nginx/sites-enabled/default

# Add our configuration file, specifyind the Reverse Proxy settings
$ cat << EOF > /etc/nginx/sites-enabled/meilisearch
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

finally we need to enable and start the nginx service as we did before, to make sure it is always available

```bash
# Reload the operating system daemons / services
$ systemctl daemon-reload

# Enable and start nginx service
$ systemctl enable nginx
$ systemctl restart nginx
```

Our MeiliSearch is now up, deployed in a production environment, using a safe API key, and being served by a Reverse Proxy Nginx. We should now be able to do requests to our server from the outside world by doing any HTTP request MeiliSearch accepts at our own IP address (http://<your-ip-address>). The IP address is the same you used to connect to your machine via SSH in Step 1.


> If you want to learn more about using Nginx as a Reverse Proxy, see its dedicated documentation [Nginx as a Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

Our only problem now is that we are using MeiliSearch under HTTP, without any additional security. This is an important issue, as the content that is being passed via HTTP can easily be read or modified by attackers, and someone could get full or partial acces to your data. In order to prevent this, it's important to use the SSL protocol, which will let us use HTTPS, a verification and encrypted way of transmitting data.

### 3.2. Activating SSL (HTTPS) on your MeiliSearch

SSL will let the user or client establish an authenticated connection to your MeiliSearch. In this way, a user can verify MeiliSearch's identity before sending sensitive data or making any request. After the identity is verified, data is sent in an encrypted way that only MeiliSearch server will be able to decrypt, giving you a fast, reliable and automatic layer of security.

Genrally, in order to activate SSL, you want to use your own domain name (or a sub-domain). The first step you need to follow is to register your own domain name, and change the DNS records. To make your domain name point to your newly installed MeiliSearch server, you just need to add an `A record` pointing to the IP address that you used to connect to your own server. This process is simple and fast, but can vary for every domain name provider, so we will not cover that process in this article.

> When you register a domain name, and add an `A record`, you should be automaticaly able to request MeiliSearch directly by using that domain name.

> It means, for illustration purposes, that if you registered your domain name `example.com`, requests for your MeiliSearch indexes can be be done at http://example.com/indexes

Now that your domain name is setup, you are ready to set SSL and use HTTPS. We will present two different options to accomplish this goal. The first option is using [Certbot](https://certbot.eff.org/), an amazing, free and very easy to use tool. In the second option, we will cover the steps you need to follow if you already have some SSL certificates issued from a `Certificate Authority or CA` for your domain name. After adding SSL, you will be ready to use MeiliSearch safely in production.

#### 3.2. Option A: Certbot

Using certbot in your Linux server is very easy and straightforward. This tool will create a free SSL certificate for your domain name, and handle the installation on your server automatically. Its documentation contains detailed instructions for diferent operating systems and servers, but we will follow the instructions for [Certbot on Debian with Nginx](https://certbot.eff.org/lets-encrypt/debianbuster-nginx)

First of all, we need to install the packages in our system:

```bash
$ sudo apt-get install certbot python-certbot-nginx -y
```

Now let's run the Certbot script that will guide us through the installation:

```bash
certbot --nginx
```

Enter your email address, agree to the Terms and Conditions, and write your domain name. Finally you will be prompted with these options:

```bash
Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
```

We recommend that you choose option 2, to redirect HTTP to HTTPS and always use a secure connection. You should be able to request your domain name with SSL as in `https://example.com` or `https://example.com/indexes`.

#### 3.2. Option B: Custom SSL Certificates

When your `Certificate Authority` issues a SSL certificate for you, you normally receive at least two files with encrypted keys: 

- Your **certificate** (normally as in `your_domain_name.pem` or `example.pem`)
- Your **key** (normally as in `your_domain_name.key` or `example.key`)

> for the command examples, we will use example.pem and example.key. Make sure to change them to match the name of your own certificate files

All we need to do is to put the certificate files somewhere safe, and modify Nginx configuration to give instructions on where to find them. Also, we recommend to do a redirection of HTTP traffic to HTTPS (port 80 to 443).

First, let's copy your certificate files in their conventional directory where the server can find them

```bash
# Create a directory /etc/ssl/example to store the certificate files
$ mkdir -p /etc/ssl/example

# Move your files to /etc/ssl/example. We will suppose that your
# files are called example.pem and example.key

$ mv path-to-your-files/example.pem /etc/ssl/example/
$ mv path-to-your-files/example.key /etc/ssl/example/
```

Finally, we create a new Nginx configuration file, and restart the daemons and Nginx service

> Remember to replace `example.com` in both `server_name` fields with your **own domain name**

```bash

# Replace example.com in both `server_name` fields with your own domain name

$ cat << EOF > /etc/nginx/sites-enabled/meilisearch
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

$ systemctl restart nginx
```

Your SSL certificates should be working and Nginx should be able to find them. Every request to `http://example.com` will now be redirected to `https://example.com`

## Conclusion

We have followed here the main steps to provide a safe and stable service. Your MeiliSearch should be up and running, in a safe environment and ready to stay available even when the most common issues occur. It is protected by a reverse proxy, with your own domain name and your API key, so your data and configuration will be accessible only for those who you trust with your keys. Communication with your server will be encrypted and its identity will be verified before sending sensitive data, and the process will be fast and automated.

You are now ready to start using your **Production-ready MeiliSearch**!

> MeiliSearch is a database: that means that it needs a file system it can write to, and which must be persistent.
