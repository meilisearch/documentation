# MeiliSearch Binary


## How to compile meiliSearch

### Dependencies 

MeiliSearch is made in `rust`. Because of that `rust` and his package manager `cargo` must [be installed](https://www.rust-lang.org/tools/install) to compile the project.

### Compiling

Once this is done, first we need to clone the project and go to the cloned directory. 

```bash
git clone https://github.com/meilisearch/MeiliDB
cd MeiliDB
```

inside the folder, lets compile meiliSearch. 

```bash
# Production version
cargo run --release
# Debug version
cargo run
```

### Accessing the binary

Inside the `target`, depending on the version you compiled, you will find the following directories : 
* `debug` : Debug version
* `release` : Production version

Inside the chosen directory, there is the ` meilidb-http` binary.

## Usage 

```bash
USAGE:
    meilidb-http [OPTIONS]

FLAGS:
    -h, --help       Prints help information
    -V, --version    Prints version information

OPTIONS:
        --api-key <api-key>              The master key allowing you to do everything on the server. [env:
                                         MEILI_API_KEY=]
        --db-path <db-path>              The destination where the database must be created. [env: MEILI_DB_PATH=]
                                         [default: /tmp/meilidb]
        --http-addr <http-addr>          The address on which the http server will listen. [env: MEILI_HTTP_ADDR=]
                                         [default: 127.0.0.1:8080]
        --no-analytics <no-analytics>    Do not send analytics to Meili. [env: MEILI_NO_ANALYTICS=]
```

::: warning
When **no master key** is set, no `X-meili-API-KEY` is needed on any route.
:::

## Executing example

### With the binary
```bash
./meilidb-http --api-key myMasterKey 
```

### With cargo
```bash
cargo run --release -- --api-key myMasterKey 
```