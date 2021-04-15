# Deploy a MeiliSearch Instance on DigitalOcean

## Create an out-of-the-box MeiliSearch

### 1. Create a new "droplet"

A "droplet" is a set of resources, as a Virtual Machine, or a Server, in which you can run your own applications.
In any DigitalOcean page, when you are logged in, you will find a menu in the upper-right corner. Click on "Create" -> "Droplets".

![Create droplet](/digitalocean/01.create.png)

### 2. Select MeiliSearch snapshot

By default, DigitalOcean will display the "distributions" tab. Select the "Marketplace" tab and search for "meili". Select it.

![Marketplace](/digitalocean/02.marketplace.png)

### 3. Select your plan

Select your plan. Plans start at $5 (click on "See all plans" for more options). Memory-optimized options will give you better results for a production environment on big datasets.

![Select plan](/digitalocean/03.select-plan.png)

### 4. Select a region for your droplet

Select the region where you want to deploy your droplet. Remember, the closer you are to your users or customers, the better will be their search experience with MeiliSearch.

![Select region](/digitalocean/04.select-region.png)

### 5. Add your ssh key

Select your SSH key in order to be able to connect to your droplet later. If you don't see your SSH key add yours to your account.

If you need help with this, visit [this link](https://www.digitalocean.com/docs/droplets/how-to/add-ssh-keys/to-account/)

You can also set a password for `root` user if you prefer this authentication method.

![Add ssh key](/digitalocean/05.add-ssh-key.png)

### 6. Choose your droplet name and tags

Here you can select the name that will be visible everywhere in your DigitalOcean account. Choose wisely!

![Droplet name](/digitalocean/06.droplet-name.png)

Tags are a very good method to know who created resources, and for organizing resources or projects. Try to always add some tags to make clear what are the server purposes.

![Add tags](/digitalocean/06.add-tags.png)

### 7. Finally click on Create Droplet

![Create droplet](/digitalocean/07.create-droplet.png)

### 8. Your MeiliSearch is running (in **development** environment)

Instance creation in progress...

![Creating](/digitalocean/08.creating.png)

... done!

![Created](/digitalocean/08.created-ip.png)

### 9. Test MeiliSearch.

Copy the public IP address:

![Copy IP](/digitalocean/09.copy-ip.png)

Paste it in your browser. If this screen is shown, your MeiliSearch is now ready!

![Test MeiliSearch](/digitalocean/09.test-meili.png)

## Configure production settings in your MeiliSearch Droplet

Configuring your MeiliSearch in a **production** environment on DigitalOcean droplet is very straightforward. Establish an SSH connection with your droplet and a script will guide you through the process.

### 1. Make your domain name point to your droplet

If you want to use your own domain name (or sub-domain), add `A record` in your domain name provider account.

![Domain to  MeiliSearch](/digitalocean/11.domain-a-record.png)

This should work out of the box. Your domain name should now be linked to your MeiliSearch instance. You can now do a health check to verify that your instance is running and your DNS is well configured:

```bash
curl -v http://<your-domain-name>/health
```

The server should answer with a `200 OK` status code and, the following body `{"status":"available"}` as shown in the example below:

```bash
...
HTTP/1.1 200 OK
...
{"status":"available"}
...
```

![Domain to  MeiliSearch](/digitalocean/11.working-domain.png)

### 2. Set API KEY and SSL (HTTPS)

Meilisearch is running in a **development** environment. You haven't set up an API KEY (anyone can read/write from your MeiliSearch) and you aren't using HTTPS yet, which makes this configuration unsafe to use in **production**.
To start the configuration process, connect via SSH to your new MeiliSearch Droplet and follow the instructions:

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

### 3. Enjoy your ready-to-use MeiliSearch Droplet

Your MeiliSearch Droplet is ready to be used in **production**.

To check if everything is running smoothly, do an HTTP call to the `/health` route:

```bash
curl -v https://<your-domain-name>/health
```

The server should answer with a `204 No content` status code as shown in the example below:

```bash
...
< HTTP/1.1 204 No Content
...
```

**Enjoy**!
