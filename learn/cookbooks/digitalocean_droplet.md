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

This is where you choose the amount of RAM, storage, and CPU cores your droplet will have. Select your plan based on your needs. Plans start at $4 (click on "See all plans" for more options). Memory-optimized options will give you better results for a production environment on big datasets.

![Selecting the plan based on your usage](/digitalocean/select-plan.png)

### 5. Choose an authentication method

You can either use SSH keys or a password to log in to your droplet. We recommend using SSH keys as they are more secure.

![Selecting SSH keys for authentication](/digitalocean/add-ssh-key.png)

Select the existing keys you want to add to your droplet. If you don't have any existing keys, you can [create a new one](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/to-account/).

### 6. Choose your droplet name and tags

Here you can select the name that will be visible everywhere in your DigitalOcean account. Choose wisely! Droplets can only contain alphanumeric characters, dashes, and periods.

![Adding 'meilisearch-droplet-name' as the hostname](/digitalocean/droplet-name.png)

Tags are great for managing resources. They are custom labels you assign to droplets. Tags can contain letters, numbers, colons, dashes, and underscores. You can use multiple tags for a single resource. Try naming tags based on a droplet's function.

![The search bar, meilisearch, and search-team tags](/digitalocean/add-tags.png)

### 7. Click on "Create Droplet"

![The "Create Droplet" button](/digitalocean/create-droplet.png)

### 8. Meilisearch is running (in **development** environment)

Instance creation in progress...

![Progress bar for the meilisearch-droplet-name instance](/digitalocean/creating-droplet.png)

... done!

![meilisearch-droplet-name instance created successfully](/digitalocean/created-droplet.png)

### 9. Test Meilisearch

To copy the public IP address, click on it:

![meilisearch-droplet-name instance's IP: 165.227.56.77](/digitalocean/copy-ip.png)

Paste it into your browser. If you can access the search preview, Meilisearch is ready!

![Meilisearch search preview](/digitalocean/test-meili.png)

## Configure production settings in your Meilisearch droplet

To configure Meilisearch in **production** on a DigitalOcean droplet, [establish an SSH connection with your droplet](https://docs.digitalocean.com/products/droplets/how-to/connect-with-ssh/) and a script will guide you through the process. Or you can use the [Droplet Console](https://docs.digitalocean.com/products/droplets/how-to/connect-with-console/) in your preferred browser.

### 1. Make your domain name point to your droplet

If you want to use your own domain name (or sub-domain), click the "Create" button and select "Domain/DNS".

![Selecting Domain/DNS from the Create menu](/digitalocean/domain.png)

Type in your domain name in the "Enter domain field" and click "Add Domain".

![Domains tab on the Networking page](/digitalocean/add-domain.png)

This should work out of the box. Your domain name should now be linked to your Meilisearch instance. You can now do a health check to verify that your instance is running and your DNS is configured:

```bash
curl -v http://<your-domain-name>/health
```

The server should answer with a `200 OK` status code and the following body `{"status": "available"}` as shown in the example below:

```bash
…
HTTP/1.1 200 OK
…
{"status": "available"}
…
```

### 2. Set master key and SSL (HTTPS)

Meilisearch is currently running in a **development** environment. We haven't set up a master key, meaning anyone can read/write to the Meilisearch instance. Since we aren't using HTTPS yet, this configuration is unsafe for **production**.

To start the configuration process, either connect to your droplet via SSH or use the Droplet Console in your preferred browser and follow the instructions:

### 2.1. Run the configuration script

Open a terminal and start a new SSH connection with the IP you got from DigitalOcean.

Type in the following command in your terminal and press Enter to establish a connection:

```bash
ssh root@DIGITAL_OCEAN_IP_ADDRESS
```

Type `yes` and press Enter to accept the authentication process.

::: note
The above command is not required if you are using the Droplet Console.
:::

A script will run automatically, asking for your settings and desired configuration. If you want to run this script again anytime, you can do so by using the following command:

```bash
meilisearch-setup
```

The same script will run automatically if you use the Droplet Console.

### 3. Enjoy your ready-to-use Meilisearch droplet

Your Meilisearch Droplet is ready to be used in **production**.

To check if everything is running smoothly, do an HTTP call to the `/health` route:

```bash
curl -v https://<your-domain-name>/health
```

The server should answer with a `200 OK` status code and the following body `{"status": "available"}` as shown in the example below:

```bash
…
HTTP/1.1 200 OK
…
{"status": "available"}
…
```

**Enjoy**!
