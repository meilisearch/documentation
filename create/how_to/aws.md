
# Deploy a meilisearch instance on amazon web services (AWS)

Using our **MeiliSearch [AMI](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html)**, MeiliSearch can be deployed on AWS in just a few minutes.

The following guide will walk you through every step to deploy MeiliSearch in an AWS EC2 instance. If you have any issues with our AWS image, please create an issue in [this repository](https://github.com/meilisearch/meilisearch-aws).

**Table of contents**:

[[toc]]

## Part 1: Deploy an out-of-the-box meilisearch instance

### 1. Launch an instance from the AWS console

After logging into your [AWS Console](https://aws.amazon.com/console), navigate to the **Compute** service. Then go to **EC2**, and finally open your **Instances** console.

![Launch an instance from AWS console](/aws/01.launch-instances.png)

In the top-right corner, click on the **Launch instances** button to start the process of configuring your MeiliSearch instance.

### 2. Select 'meilisearch' AMI from 'Community AMIs'

You will now select which AMI or system Image to use to run your instance. Type **"meilisearch"** in the searchbar and select the **Community AMIs** tab on the left sidebar.

![Choose MeiliSearch AMI from Community AMIs](/aws/02.select-ami.png)

Click on **Select** (right side of the screen) to confirm your choice.

### 3. Size and Specs

Select the specifications of the server you want MeiliSearch to run on.

![Size and specs](/aws/03.size-and-specs.png)

> We recommend prioritizing memory allocation for better MeiliSearch performance.
> Note that the **free tier** is sufficient for tests or prototypes, but not recommended for large datasets.

Once you've made your choice, click on **Next: Configure instance details** to continue.

### 4. Instance details

Here you can specify [details of your Instance](https://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html). Since **this section is not required to run MeiliSearch**, we won't cover it in this guide.

![Instance details (optional)](/aws/04.instance-details.png)

Simply click on **Next: Add Storage** to keep going.

### 5. Storage

Choose the storage **device** and **size** for your MeiliSearch instance.

![Storage](/aws/05.storage.png)

The amount of storage space required can [vary drastically](/reference/under_the_hood/storage.md#measured-disk-usage) depending on the data you plan to index. In this example, we will use 25 GiB, which is more than enough for most small datasets (< 1 million documents).

When you're ready, click on **Next: Add Tags** to continue.

### 6. Tags

Tags are used to identify your resources in AWS. **They are not required by MeiliSearch**.

![Tags](/aws/06.tags.png)

Click on **Next: Configure Security Groups**.

### 7. Security groups: networking and connectivity

For your MeiliSearch instance to communicate with the outside world, it is very important to allow SSH connections, HTTP, and HTTPS traffic.

- Click on **Add rule** and select **HTTP** from the drop-down menu. This will open the HTTP port (80).
- Click on **Add rule** and select **HTTPS** from the drop-down menu. This will open the HTTPS port (443).

![Security Groups: Networking and connectivity](/aws/07.security.png)

> By default, opened ports accept inbound traffic from any origin. If you prefer to restrict the IP adresses that are allowed to request your MeiliSearch instance, go to the **Source** column and select the **Custom** option.

You can also **use an existing security group**, if preferred.

Once your configuration looks similar to the above image, click on **Review and Launch**.

### 8. Set and download key pair

Once you have reviewed your instance configuration, there is one last step before you can launch your Instance.

Click on **Launch** and a pop-up window will ask you to select a **key pair**. This key pair is very important as it will be your private key to access the instance via SSH, which is required to [configure your MeiliSearch instance in a production environment](#part-2-configure-production-settings).

![Key Pair](/aws/08.key-pair.png)

If you have an existing Key Pair, you can use that. Otherwise, select the option **Create a new key pair** and give it a name. Then, click on **Download Key Pair** and store this file somewhere safe.

Once you've downloaded your key pair (and only then), click on **Launch Instances**, then on **View Instances**.

### 9. Enjoy your meilisearch instance running on AWS!

Your instance may take a minute or two to get up and running (see the **Instance state** column).

![Launch](/aws/09.launch.png)

Once the instance is ready, use your web browser to navigate to the **Public IPv4 address** or the **Public IPv4 DNS**. You should see the MeiliSearch [web interface](/reference/features/web_interface.md).

![Enjoy](/aws/10.enjoy.png)

> Your MeiliSearch instance is now ready to use!

Keep in mind that your MeiliSearch instance is currently running in a *development environment*, which is unsafe for production usage. If you want to set up a *production environment*, continue to the [next section](#part-2-configure-production-settings).

Otherwise, if you want to get started creating indexes and adding documents, don't hesitate to check out our [learning resources](/learn), [API Reference](/reference), or [getting started guide](/learn/getting_started/quick_start.md).

And of course, **enjoy**!

## Part 2: Configure production settings

Configuring your MeiliSearch instance in a production environment is not just straightforward—it's completely automated. Simply establish an SSH connection with your instance, and a script will guide you through the process.

### 1. Make your domain name point to your instance IP

If you want to use your own domain name (or sub-domain), add an `A record` in your domain name provider account. Otherwise, **you can skip this step**.

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

### 2. Set API key and SSL (HTTPS)

Meilisearch is currently running in a *development environment*. You haven't set up an **API key**, meaning that anyone can read/write from your MeiliSearch, and you aren't using HTTPS yet, which makes this configuration unsafe for production.

To start the configuration process, connect via SSH to your new MeiliSearch Instance and follow the instructions that appear.

### 2.1. Secure your key pair

Open a terminal window and navigate to wherever you saved your [key pair](#_8-set-and-download-key-pair). It should be a `.pem` file.

Run the following command to secure your key pair.

```bash
chmod 400 <YourMeiliSearchKeyPair>.pem
```

### 2.2. Run the configuration script

Next, start a new SSH connection with the **Public IPv4 address** or **your domain name**, using 'admin' as the username. You'll also need to supply the relative path to your `.pem` file.

```bash
ssh -i <relative-path-to-your-key-pair> admin@<your-ipv4-address>
```

```bash
ssh -i <relative-path-to-your-pem-file> admin@<your-domain-name>
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

When asked if you would like to use MeiliSearch in a production environment, write `yes` and press `Enter` to accept the authentication process.

A script will run automatically, asking for your settings and desired configuration. If you want to run this script again at any time, you can do so by using the following command:

```bash
meilisearch-setup
```

### 3. Enjoy your ready-to-use meiliSearch instance

Your MeiliSearch Instance is up and running on AWS, and it is ready to be used in **production**.

To check if everything is running smoothly, do another HTTP call to the `/health` route:

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

You're all set to use MeiliSearch in production with AWS! If you have any issues with our AWS image, please create an issue in [this repository](https://github.com/meilisearch/meilisearch-aws).
