#!/bin/bash

MAX_ATTEMPTS=30
RETRY_INTERVAL=10

# Wait for MongoDB to start
for i in $(seq 1 $MAX_ATTEMPTS); do
    if mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
        echo "[HC] MongoDB is responsive."
        break
    fi
    echo "[HC] Attempt $i/$MAX_ATTEMPTS: Waiting for MongoDB to start..."
    sleep $RETRY_INTERVAL
    if [ $i -eq $MAX_ATTEMPTS ]; then
        echo "[HC] MongoDB failed to start after $MAX_ATTEMPTS attempts."
        exit 1
    fi
done

# Check if MongoDB replica set is ready
for i in $(seq 1 $MAX_ATTEMPTS); do
    rs_status=$(mongosh --quiet --eval 'rs.status().ok' --authenticationDatabase admin -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" || echo "0")
    if [ "$rs_status" = "1" ]; then
        echo "[HC] MongoDB replica set is ready."
        exit 0
    fi
    echo "[HC] Attempt $i/$MAX_ATTEMPTS: Waiting for MongoDB replica set to be ready..."
    sleep $RETRY_INTERVAL
    if [ $i -eq $MAX_ATTEMPTS ]; then
        echo "[HC] MongoDB replica set failed to initialize after $MAX_ATTEMPTS attempts."
        exit 1
    fi
done

echo "[HC] MongoDB healthcheck failed."
exit 1