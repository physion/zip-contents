#!/usr/bin/env bash

# Associate catalyze environment
git remote add catalyze ssh://git@git.pod02.catalyzeapps.com:2222/pod02234-code-551783591.git

# Deploy
git fetch --unshallow || true
git push catalyze ${CI_COMMIT_ID}:master