# Deploy a Meilisearch instance on Railway

## Introduction

This guide explains how to deploy a ready-to-use Meilisearch instance on Railway.

[Railway](https://railway.app) is a deployment platform where you can provision infrastructure, develop with that infrastructure locally, and then deploy to the cloud.

Railway aims to be the simplest way to develop, deploy, and diagnose issues with your application. Railway offers additional features that are worth exploring.

- Railway lets you create parallel, identical environments for PRs/testing.
- Railway lets you run as much (or as little) compute as you'd like with its usage based pricing and a metrics dashboard included in every project.
- Adding team members to your projects is as easy as sending them an invite link.
- Railway supports projects of any size, you can deploy additional services to the same project or deploy subdirectories of a monorepo.

As your Project scales, Railway scales with you by supporting with multiple members per Project, Teams, and Autoscaling- leaving you to focus on what matters: your code.

## Requirements

To follow along, you need a [Railway account](https://railway.app). If you don't have one, you can visit the link above and click on "Login" in the top right corner to log in either with your GitHub account or email.

## Deploy Meilisearch

Click the button below to deploy a Meilisearch instance to Railway quickly.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/TXxa09?referralCode=YltNo3)

Do not forget to replace the `MEILI_MASTER_KEY` environment variable with a strong key to secure your Meilisearch instance.

If you want to quickly generate a secure random key, you can run the following command from your terminal:

```bash
openssl rand -base64 48
```

To define the desired length of your password, you can either add `| cat -c-${DESIRED_LENGTH}` or `| head -c${DESIRED_LENGTH}` to the command as such:

```bash
openssl rand -base64 48 | cut -c1-32
```

```bash
openssl rand -base64 48 | head -c32
```

which in this case will generate a 32-character long string.

::: warning
Setting a master key is optional, but without it, your server will accept unidentified requests, which can affect your usage quota on the server. If you need some protection in production, we strongly recommend setting a master key.
:::

### Test Meilisearch

Copy the public URL (e.g., `meilisearch-production-up.railway.app`) of your project from your [Railway account dashboard](https://railway.app/dashboard) and paste it into your browser.

![Railway dashboard](/railway/public-url.png)

You should land on the Meilisearch [search preview](/learn/what_is_meilisearch/search_preview.md), where you will be asked to enter your master key.

You are now ready to [create your first index](/learn/getting_started/quick_start.md)!

**Enjoy**!
