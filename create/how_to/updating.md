# Update to the Latest MeiliSearch Version

Currently, MeiliSearch versions are not compatible with each other. If you try to use the same database with different versions, you’ll get the following error:

`Error: Cannot open database, expected MeiliSearch engine version: 0.16.XX, current engine version: 0.18.1`

If you already have a MeiliSearch database with some data you don’t want to lose, you are in the right place. We’ll guide you through all the steps to migrate your data to the most recent version of MeiliSearch.

If your database version is v0.15.0 or above, continue to the next section. If your version is v.14.0 or below, [go here](#upgrading-from-v0140-or-below).


## Upgrading from v.015.0 or above


It is very simple to upgrade from v.15.0 or above since the dumps feature is available for those versions. You just need to create a dump, which is sort of a copy of your dataset that can be used with any version of MeiliSearch.

### Step 1: Set all fields as displayedAttributes

When creating dumps, MeiliSearch calls the same service as the GET /documents route.
Meaning that if a field is not in the displayed-attribute list, it won’t get returned with the document. 

By default, all fields are considered to be displayedAttributes. But, if you don’t want to lose document information, it is important to check that all fields are set to be displayed. You can verify your setup by making a GET request to the following endpoint: 

GET /indexes/:index_uid/settings/displayed-attributes

If the returned value is: ["*"], you are good,
If not, then you need to reset the displayed-attributes settings to their default value ([*]). You can use the DELETE /indexes/:index_uid/settings/displayed-attributes endpoint.

### Step 2: Create the dump

To create a dump you just have to make a POST request to the following endpoint /dumps.
MeiliSearch will create a dumps/ folder to store the created dump. You can modify the dumps destination by specifying the route of the directory of your choice in the command line or through an environment variable, when starting the process. 

The server will then return a response that should like like this:

{"uid":"20210212-151153878","status":"in_progress"}

Since the dump creation is an asynchronous process, it may take some time. That’s why the uid comes in handy to know the process status. 
You can make a GET /dumps/:dump_uid/status request.
And you’ll know if it’s still “in progress”, “done” or if some problem occurred.

### Step 3: Import the dump

Now that you’ve got your dump, you just need to install the latest version of MeiliSearch and import the dump at launch, like so:

./meilisearch --import-dump /dumps/20210212-151153878.dump

Importing a dump is the same process as indexing documents for the first time, it can require some time and memory. You may want to make batches to import your dumps. You can set the batch size through a CLI option: 
--dump-batch-size 
Or an environment variable: MEILI_DUMP_BATCH_SIZE
The default size iis 1024 documents per batch.

Finally, don’t forget to set the displayedAttributes to their previous value, if needed.

## Upgrading from v.014.0 or below

Since dumps didn’t exist back then, the best solution would be to save your documents and your settings in JSON files. 

If you don’t have any particular setting you want to keep, you can move to step 2.

### Step 1: Save your settings

First of all, we need to retrieve the settings using the GET /settings endpoint. It is important to first get the settings and then the documents because you might need to modify the settings to retrieve the documents in their entirety. You can get the settings and save them to a file using the method you prefer, for simplicity reasons, we are going to use curl in this example:

curl -X GET “http://127.0.0.1:7700/indexes/:index_uid/settings” -o mysettings.json 

Note: cURL can be instructed to save data into a local file, with the -o option (-o stands for output)

### Step 2: Check your settings 

In order to save all the information present in the documents. All fields must be set as displayedAttributes. 

You can verify your setup by making a GET request to the following endpoint: 

GET /indexes/:index_uid/settings/displayed-attributes

If the returned value is: ["*"],  all attributes are set as displayed, you can continue to step 3.

If not, then you might want to reset the displayed-attributes settings to their default value (all). To do so, you just have to make a DELETE /settings/displayed-attributes request.

Now that all fields are included in the displayedAttributes. You can proceed to save the documents, without risking any information loss.

### Step 3: Save the documents

You can request your documents and save them in a file. An easy way to do so is using curl:

curl -X GET “http://127.0.0.1:7700/indexes/:index_uid/documents” -o mydocuments.json


### Step 4: Upload your data to the latest version of MeiliSearch

Finally, you can install the latest version of MeiliSearch and upload your data as usual.
If you saved your settings, the addition should be done in a particular order:
upload your settings
add your documents

This order is crucial to indexation speed.
