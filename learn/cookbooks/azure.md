# Deploy a Meilisearch instance on Azure

_The following is a guest post by Christopher Maneu, Data Engineering Lead Advocate at Microsoft._

## Introduction

In this tutorial, we will see how to deploy a Meilisearch instance on Azure, and also some considerations for hosting a production Meilisearch instance on Azure.

::: tip
If you don't have yet an Azure subscription, you can [create one here](https://azure.microsoft.com/free/). With the Azure Free tier, you can run a Meilisearch instance for free for at least 12 months.
:::

## One-Click Deploy

You can deploy a Meilisearch instance via the official [Meilisearch Docker image](https://hub.docker.com/r/getmeili/meilisearch) by clicking the following button 

[![Deploy To Azure](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.svg?sanitize=true)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fcmaneu%2Fmeilisearch-on-azure%2Fmain%2Fmain.json).

![The Azure portal prompting for information to deploy Meilisearch](/azure/01.azure-deploy-button.png)

When clicking this button, you'll be redirected to the Azure Portal, and asked a few questions: 

- **Region**: This is the deployment region. You should select a region close to you or your users,
- **Environment**: The name of the environment you want to deploy to, like `dev` (for development) or `prod` (for production). This settings has no effects on the type of resources deployed. It's just for convenience.
- **Application Name**: The name of your application. This name should be **unique across all Azure customers**. The URL where your application is deployed will contain this value.
- **Location**: This the resources location. For reasons out of scope of this documentation, this parameter is different from the _Region_ one. By default, it is set to `eastus`, but you can type any Azure location (like `francecentral`, `westeurope`, or `japaneast`).
- **Meilisearch_apikey**: This is the Meilisearch Master Key. While we generate a random key by default, we encourage you to set your own key.

Once you filled these info, click the **Review + create** button, and then the **Create** button.

::: warning
By default, the instance created is on a Standard plan. This will incurr costs in your subscription. You can change it to a Free tier later, or by editing the Infrastructure as Code (see below).
:::

After a few minutes, the deployment will be complete. You'll be able to access your instance URL by clicking on the **Outputs** tabs on the left.

![The Azure portal showing informations about your Meilisearch deployment](/azure/02.azure-output.png)

::: tip
While Meilisearch is usually exposed on port `7700`, this deployment will expose your instance on port `433`. An SSL certificate will be generated and managed for you by Azure.
:::

### What is happening with this one-click button?

This button uses an Infrastructure as code bicep file. The code is opensource and hosted on [GitHub](https://github.com/cmaneu/meilisearch-on-azure). You can submit PRs if needed, or use it in your own projects.

This code will setup two main components: 

- An **Azure App Service** instance to host Meilisearch container
- An **Azure File Share** who is volume-mapped into the Meilisearch container for database persistence. 

## Production-ready deployment

We've made some _opinionated choices_ in the One-click deployment that should work for most production-ready deployments. This section explains some of these choices you need to be aware in the context of a production deployment.

### Data redundancy and backup

The one-click button create a storage with the "LRS" redundancy option. That means that your data is replicated across multiples servers, but in the same Datacenter. You can change - by modifying the template) this setting to choose a multi-zone or a multi-region redundancy option.

By default, there is no automatic backup of your index. If you want to use Azure Backup capabilities to achieve this result, you can look at [Azure File Share Backup](https://docs.microsoft.com/azure/backup/azure-file-share-backup-overview).

::: tip
Meilisearch has a snapshot and dump features that could help you achieve backup capabilities. See [Data Backup documentation](/learn/advanced/snapshots_vs_dumps.md) for more information.
:::

### Always-on

To enable free tier, the _Always-on_ option is disabled by default. That means that after some time without any traffic, your instance will be deallocated. When the next client hit your instance, it'll be started again automatically. However, you will have a response time in the dozen-seconds range. 

You can avoid this _cold start_ by enabling the _Always-on_ feature, either in the Azure portal or in the Infrastructure as Code.

### App Service Auto-Scale

 Azure App Service offer an horizontal auto-scale feature that allows to automatically add more servers to process incoming requests.

 At time of writing, Meilisearch is not ready to handle multiple servers using the same underlying storage. Enabling this feature can cause unexpected results and should **not** be considered for a production environment.

 If you need more processing power, you can use the _Scale-Up_ feature of App Service.