# Deploy a MeiliSearch Instance on GCP Compute Engine

Using our MeiliSearch GCP custom image, MeiliSearch can be deployed on GCP in just a few minutes.

The following `how-to guide` will walk you through every step to deploy MeiliSearch in an GCP Compute Engine instance. If you have any problems with our GCP image, please create an issue in [this repository](https://github.com/meilisearch/meilisearch-gcp).

**Table of Contents**:

[[toc]]

## Part 1: Deploy a MeiliSearch instance

### 1. Import MeiliSearch custom image on your GCP account

- Navigate to `Compute Engine` => `Images`.

- Click on `[+] CREATE IMAGE`.

- Give it a name (`meilisearch-v0-20-0`).

- For the `Source` field select `Virtual disk (VMDK, VHD)`.

- You may be prompted to enable Cloud Build tools and grant permissions. Do it.

- Copy the following URI in the `Cloud Storage file` field.

```
gs://meilisearch-image/meilisearch-v0.20.0-debian-10.vmdk
```

- The other fields are not required and are optional.

- Click on `Create`. This process can take up to 5 or 6 minutes, while the MeiliSearch custom image imports to your account.

### 2. Create a new GCP Compute Engine instance from the imported image

- Open the tab `Images` and click on the name of the image that you just imported, and click on the `[+] Create instance` button.

- Give your instance a name

- In the `Machine configuration` section, make sure to pick a machine type with enough memory  to run MeiliSearch according to your needs. More memory allows faster searching.

- In the `Boot disk` section, click the `Change` button. From the `Custom images` tab, select the image that you just imported in the previous steps (meilisearch-v0-20-0) from the drop down menu. Don't forget to set the `Size` of the disk to an amount corresponding to your needs. When you are done, click on `Select`.

- In the `Firewall` section, make sure to check the `Allow HTTP traffic` and `Allow HTTPS traffic` boxes so that your MeiliSearch instance can communicate with the internet.

- Finally, click on the `Create` button. After a minute or two, your MeiliSearch instance should be up and running.

You can check that your instance is running correctly by copying and pasting the `External IP` address provided by GCP into your browser, or by typing the following command on your terminal:

```bash
curl http://<your-external-ip>/health
```

The server should answer with a `200 OK` status code as shown in the example below:

```bash
{"status":"available"}
```

## Part 2: Set your instance to a production environment

Configuring your MeiliSearch instance in a production environment is not just straightforward—it's completely automated. Establish an SSH connection with your instance, and a script will guide you through the process.

### 1. Make your domain name point to your Instance IP

If you want to use a custom domain name (or sub-domain), add an `A record` in your domain name provider account. Otherwise, you can skip this step.

![Domain to  MeiliSearch](/aws/11.domain.png)

Your domain name should now be linked to your MeiliSearch instance. Run a health check to verify that your instance is running and your DNS is well configured:

```bash
curl -v http://<your-domain-name>/health
```

The server should answer with a `200 OK` status code as shown in the example below:

```bash
...
< HTTP/1.1 200 OK
...
```

### 2. Set API KEY and SSL (HTTPS)

Meilisearch is currently running in a *development environment*. You haven't set up an API key, meaning that anyone can read/write from your MeiliSearch, and you aren't using HTTPS yet, which makes this configuration unsafe for production.

To start the configuration process, connect via SSH to your new MeiliSearch instance and follow the instructions that appear.

### 2.2. Run the configuration script

#### 2.2.1 Option 1: Using the Google Cloud console

Navigate to Compute Engine => VM instances. Click on the name of your instance, and then click on the SSH button (make sure to have pop-ups enabled or the window may be blocked). The connection will be established and the script will automatically run.

#### 2.2.2 Option 2: Add your SSH key to the Compute Engine metadata

- Make sure that you have an SSH public key (normally stored in `~/.ssh/id_rsa.pub`). If you haven't created your SSH key or want to generate a new one, you can follow [this guide](https://www.ssh.com/ssh/keygen/).

- On the GCP dashboard, navigate to `Compute Engine` => `Metadata`, and click on the`SSH Keys` tab. Click on `Edit`.

- To add a new SSH key, click on `+ Add item`. Copy your Public key and paste it on the new box that has been created on the GCP interface. Usually you can read your public key by running the following command on a terminal:

```bash
cat ~/.ssh/id_rsa.pub
```

- Click on `Save`.

Now establish an SSH connection using the same username that is present on your SSH key. If you are adding your local system key, it will probably be your username on your local system. To know what this username is in UNIX-like systems, run the command:

```
whoami
```

Then establish a connection using the following command:

```bash
ssh <your-username>@<your-external-ip-or-domain-name>
```

You should see something like this:

```
________________________________________________
________________________________________________
             _ _ _ __                     _
  /\/\   ___(_) (_) _\ ___  __ _ _ __ ___| |__
 /    \ / _ \ | | \ \ / _ \/ _` | '__/ __| '_ \
/ /\/\ \  __/ | | |\ \  __/ (_| | | | (__| | | |
\/    \/\___|_|_|_\__/\___|\__,_|_|  \___|_| |_|

________________________________________________
________________________________________________
```

If it’s your first time accessing the instance via SSH, a script will run automatically asking for your settings and desired configuration. If you want to run this script again at any time, you can do so by using the following command:

```bash
meilisearch-setup
```

### 3. Enjoy your ready-to-use MeiliSearch instance

Your MeiliSearch instance is up and running on GCP and ready to be used in production.

To make sure that everything is running smoothly, do a final HTTP call to the `/health` route:

```bash
curl -v https://<your-domain-name>/health
```

> Note that this time, we're using HTTPS.

The server should answer with a `200 OK` status code as shown in the example below:

```bash
...
< HTTP/1.1 200 OK
...
```

You're all set to use MeiliSearch in production with GCP! If you have any problems with our GCP image, please create an issue in [this repository](https://github.com/meilisearch/meilisearch-gcp).
