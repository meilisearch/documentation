#!/bin/bash

# Prompt the user for the variable to search for
echo "Enter the variable to search for:"
read variable

# Use grep to search for the variable in the file
grep --color -rnwiec "$variable" ./learn ./reference ./resources ./.code-samples.meilisearch.yaml
grep --color -rc "$variable" ./learn ./reference ./resources ./.code-samples.meilisearch.yaml
