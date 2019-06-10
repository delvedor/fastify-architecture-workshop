#!/bin/bash

# run this file to get a working ES instance
# for running the test locally

exec docker run \
  --rm \
  -e "discovery.type=single-node" \
  -p 9200:9200 \
  docker.elastic.co/elasticsearch/elasticsearch:7.1.0
