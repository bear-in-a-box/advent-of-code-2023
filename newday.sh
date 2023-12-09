#!/bin/bash

if [ ! -f .env ]
then
  echo "Missing .env file"
  exit 1
else
  export $(cat .env | xargs)
fi

year="$(date +%Y)"
day="$(date +%d)"
dayWithoutLeadingZero="$(echo $day | sed 's/^0*//')"

mkdir days/$day
touch days/$day/{a,b}.ts
touch days/$day/{example,input}.txt
curl --cookie "session=$AOC_SESSION" "https://adventofcode.com/$year/day/$dayWithoutLeadingZero/input" -o days/$day/input.txt
echo "--- paste an example here ---" > days/$day/example.txt
