#!/bin/bash

for i in $(seq 0 10000); do
  padded_number=$(printf "%06d" $i)
  echo "POST http://localhost:3000/sms"
  echo "Content-Type: application/json"
  echo "{\"phone\":\"+88017$padded_number\",\"text\":\"this is a text\"}"
  echo ""
done > target-5000.txt
