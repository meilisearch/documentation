# Deploy a Meilisearch instance on Fly.io

## Introduction

This guide explains how to deploy a ready-to-use Meilisearch instance on Fly.io.
First time I tryed this I've had some problems that wasted me a lot of time, so to save you the time I'll create step-by-step instuctions.


## Just do it

So if you want to deploy it to fly io as fast as possible, [this is the way](https://i.imgflip.com/4pw07x.jpg).

In any folder create `fly.toml`, and copy the content
```toml
app = "my-meilisearch"
kill_signal = "SIGINT"
kill_timeout = 5
processes = []

[build]
  image = "getmeili/meilisearch"

[env]

[experimental]
  allowed_public_ports = []
  auto_rollback = true

[[mounts]]
  source = "disc1"
  destination = "/meili_data"

[[services]]
  http_checks = []
  internal_port = 7700
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```
then login in fly io!

```flyctl login```

and then deploy it!

```flyctl deploy```



## Theory

### persistant storage
So, the "hard" part of deploying is to create persistant storage.
Fly.io has a guide on that [here](https://fly.io/blog/persistent-storage-and-fast-remote-builds/), but in short you need to add this part to your toml. 

```toml
[[mounts]]
  source = "disc1"
  destination = "/meili_data"
```
This creates disc, that is mapped to this folder `meili_data`.

Why use /meili_data, because there is where melisearch stores your data.

### docker image

If you want fly io to use docker image from docker hub you need to specify image in build step like this:
```toml
[build]
  image = "getmeili/meilisearch"
```

### port 
Meilisearch is by default on port 7700, so you need to tell fly io to listen to internal 7700 port.
```toml
[[services]]
  internal_port = 7700
```

Everthing else is pritty much default. 

And that's it 🎉!





