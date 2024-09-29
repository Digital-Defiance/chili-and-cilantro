#!/bin/bash

# Wait for MongoDB to start
until mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; do
  echo "Waiting for MongoDB to start..."
  sleep 5
done

# Check if MongoDB replica set is ready
is_master=$(mongosh --quiet --eval 'db.isMaster().ismaster' --authenticationDatabase admin -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD")
if [ "$is_master" != "true" ]; then
  echo "MongoDB replica set is not yet ready."
  exit 1
fi

echo "MongoDB is up and running with replica set."
exit 0
