# Telemetry

MeiliSearch collects anonymized data from users in order to improve our product. This can be [deactivated at any time](#how-to-disable-data-collection).

Note that while MeiliSearch is running in [`development` mode](/reference/features/configuration.md#environment), no data is collected.

## Why collect telemetry data?

We collect anonymized data for only two reasons: so that we can improve our product, and so that we can continue working on this project full-time.

In order to better address our users' needs and chart a clear path forward for MeiliSearch, we need reliable quantitative information. The information we collect helps us fix bugs, evaluate the success of certain features, and identify our strengths and weaknesses as a product.

Usage metrics also help us justify our existence to investors so that we can keep the MeiliSearch project alive. They prove what we all believe: that MeiliSearch is a great product that can be of use to a large number of people around the world.

## What kind of data do we collect?

We use two data-collection tools: [Amplitude](https://amplitude.com/amplitude-analytics) and [Sentry](https://sentry.io/welcome/). Both can be disabled by [following the below procedure](#how-to-disable-data-collection).

**Amplitude** collects the following datapoints:

- Amount of time the MeiliSearch instance has been running
- MeiliSearch version
- Technical specs of the device running MeiliSearch
- Number of documents per index

**Sentry** collects information about errors that occur while using MeiliSearch—in other words, bug reports and diagnostics.

**We will absolutely never identify users, track users, or collect private information**, including IP address, email, or website URLs. All of our data collection is **GDPR-compliant** and **secure**.

::: tip

In the future, we may collect additional metrics relating to new features. To have the most up-to-date info, be sure to check the release notes after each new version. <Badge text="soon" type="warn"/>

:::

## How to disable data collection

Data collection can be disabled at any time by setting a command-line option or environment variable, then restarting the MeiliSearch instance.

:::: tabs

::: tab Command-line option

```bash
meilisearch --no-analytics=true
```

:::

::: tab Environment variable

```bash
export MEILI_NO_ANALYTICS=true
meilisearch
```

:::

::: tab Cloud service

```bash
# The following procedure should work for DO, GCP, and AWS
# First, open /etc/systemd/system/meilisearch.service with a text editor
# vim /etc/systemd/system/meilisearch.service
# Then add --no-analytics=true at the end of the command in ExecStart
# Don't forget to save and quit!

systemctl daemon-reload
systemctl restart meilisearch
```

:::

::::

For more information about configuring MeiliSearch, read our [configuration reference](/reference/features/configuration.md).
