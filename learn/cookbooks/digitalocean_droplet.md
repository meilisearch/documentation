# Deploy a Meilisearch instance on DigitalOcean

## Deploy Meilisearch on a DigitalOcean droplet

### 1. Create a new "droplet"

A "droplet" is a set of resources, such as a Virtual Machine, or a Server, in which you can run your applications.

Once you log in to your DigitalOcean account, click the green "Create" button at the top-right of the page and select "Droplets".

![Selecting "Droplets" from the "Create" dropdown](/digitalocean/create.png)

### 2. Select a region for your droplet

Select the region where you want to deploy your droplet. Remember, the closer you are to your users or customers, the better will be their search experience with Meilisearch.

![Selecting the London data center region](/digitalocean/select-region.png)

### 3. Select Meilisearch image

By default, DigitalOcean will display the "OS" tab. Select the "Marketplace" tab, search for "Meilisearch", and select the image.

![Search results for 'Meilisearch' in Marketplace](/digitalocean/marketplace.png)

### 4. Choose size

This is where you choose the amount of RAM, storage, and CPU cores your droplet will have. Select your plan. Plans start at $5 (click on "See all plans" for more options). Memory-optimized options will give you better results for a production environment on big datasets.

![Selecting the plan based on your usage](/digitalocean/select-plan.png)

### 5. Choose an authentication method

You can either use SSH keys or a password to log in to your droplet. We recommend using SSH keys as they are more secure.

Check the boxes for the existing keys you want to add to your droplet. If you don't have any existing keys, you can [create a new one](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/to-account/).

![Selecting SSH keys for authentication](/digitalocean/add-ssh-key.png)

### 6. Choose your droplet name and tags

Here you can select the name that will be visible everywhere in your DigitalOcean account. Choose wisely! Droplets can only contain alphanumeric characters, dashes, and periods.

![Adding 'meilisearch-droplet-name' as the hostname](/digitalocean/droplet-name.png)

Tags are a very good method to know who created resources, and for organizing resources or projects. Tags can contain letters, numbers, colons, dashes, and underscores. Try to always add some tags to make clear what are the server purposes.

![The search bar, meilisearch, and search-team tags](/digitalocean/add-tags.png)

### 7. Click on "Create Droplet"

![The "Create Droplet" button](/digitalocean/create-droplet.png)

### 8. Your Meilisearch is running (in **development** environment)

Instance creation in progress...

![Progress bar for the meilisearch-droplet-name instance](/digitalocean/creating-droplet.png)

... done!

![meilisearch-droplet-name instance created successfully](/digitalocean/created-droplet.png)

### 9. Test Meilisearch

To copy the public IP address, click on it:

![meilisearch-droplet-name instance's IP: 165.227.56.77](/digitalocean/copy-ip.png)

Paste it into your browser. If you can access the search preview, your Meilisearch is now ready!

![Meilisearch search preview](/digitalocean/test-meili.png)

## Configure production settings in your Meilisearch droplet

Configuring your Meilisearch in a **production** environment on DigitalOcean droplet is very straightforward. Establish an SSH connection with your droplet and a script will guide you through the process.

### 1. Make your domain name point to your droplet

If you want to use your own domain name (or sub-domain), add `A record` in your domain name provider account.

![An interface for editing DNS records with "Type": A, "Name": droplet, "IPv4 address": 165.227.56.77, and "TTL": Auto](/digitalocean/11.domain-a-record.png)

This should work out of the box. Your domain name should now be linked to your Meilisearch instance. You can now do a health check to verify that your instance is running and your DNS is well configured:

```bash
curl -v http://<your-domain-name>/health
```

The server should answer with a `200 OK` status code and the following body `{"status": "available"}` as shown in the example below:

```bash
...
HTTP/1.1 200 OK
...
{"status": "available"}
...
```

![Meilisearch interface](/digitalocean/11.working-domain.png)

### 2. Set API key and SSL (HTTPS)

Meilisearch is currently running in a **development** environment. You haven't set up an API key, meaning that anyone can read/write from your Meilisearch, and you aren't using HTTPS yet, which makes this configuration unsafe for **production**.
To start the configuration process, connect via SSH to your new Meilisearch Droplet and follow the instructions:

### 2.1. Run the configuration script

Open a terminal and start a new SSH connection with the IP you got from DigitalOcean.

Write in your terminal `ssh root@<your-ip-address>` and press Enter to establish connection:

```bash
ssh root@42.42.42.42
```

Write `yes` and press Enter to accept the authentication process.

A script will run automatically, asking for your settings and desired configuration. If you want to run this script again anytime, you can do so by using the following command:

```bash
meilisearch-setup
```

### 3. Enjoy your ready-to-use Meilisearch droplet

Your Meilisearch Droplet is ready to be used in **production**.

To check if everything is running smoothly, do an HTTP call to the `/health` route:

```bash
curl -v https://<your-domain-name>/health
```

The server should answer with a `200 OK` status code and the following body `{"status": "available"}` as shown in the example below:

```bash
...
HTTP/1.1 200 OK
...
{"status": "available"}
...
```

**Enjoy**!
