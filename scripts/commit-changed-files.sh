#!/usr/bin/env bash
# Commits each changed file separately as meili-bot, then pushes to main.
# One commit per file keeps each automated update easy to revert.
#
# Usage: scripts/commit-changed-files.sh <file>...

set -euo pipefail

git config user.name "meili-bot"
git config user.email "robot@meilisearch.com"

for file in "$@"; do
  if [ -n "$(git status --porcelain -- "$file")" ]; then
    echo "There are changes in $file."
    git add "$file"
    git commit -m "[AUTOMATION POST DEPLOYMENT] Update $file"
  else
    echo "No changes in $file."
  fi
done

if [ "$(git rev-list --count origin/main..HEAD)" -gt 0 ]; then
  git push origin main
fi
