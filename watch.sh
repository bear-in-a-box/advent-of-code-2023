#!/bin/bash
set -e

day="$(date +%d)"
part="${*: -1}"
filename="./days/$day/$part.ts"

if ! grep -qE "^(a|b)$" <<< "$part"
then
  echo "Error: No part provided. Possible parts: a, b"
  exit 1
fi

npx nodemon $filename
