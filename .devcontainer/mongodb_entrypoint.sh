#!/bin/bash
set -e

echo "Hostname: $(hostname)"

# Environment Variables with Defaults
MONGO_LOG=${MONGO_LOG:-"/var/log/mongodb/mongod.log"}
MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-"chilicilantro"}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-"Ch1l1C1l4ntr0"}
MONGO_REPLICA_SET_NAME=${MONGO_REPLICA_SET_NAME:-"rs0"}
MONGO_BIND_IP=${MONGO_BIND_IP:-"0.0.0.0"}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_KEYFILE=${MONGO_KEYFILE:-"/tmp/replica.key"}
MONGO_DB_PATH=${MONGO_DB_PATH:-"/data/db"}
MAX_ATTEMPTS=30
RETRY_INTERVAL=${RETRY_INTERVAL:-30}
SETUP_COMPLETE_FILE="/data/db/.setup_complete"

start_mongo_noauth() {
    echo "Starting MongoDB without authentication..."
    mongod --replSet "$MONGO_REPLICA_SET_NAME" --bind_ip_all --dbpath "$MONGO_DB_PATH" --logpath "$MONGO_LOG" --fork
}

wait_for_mongo() {
    echo "Waiting for MongoDB to be ready..."
    for i in $(seq 1 $MAX_ATTEMPTS); do
        if mongosh --quiet --eval "db.runCommand({ ping: 1 })" &>/dev/null; then
            echo "MongoDB is ready."
            return 0
        fi
        echo "Attempt $i: MongoDB not ready yet, retrying in $RETRY_INTERVAL seconds..."
        sleep $RETRY_INTERVAL
    done
    echo "Failed to connect to MongoDB after $MAX_ATTEMPTS attempts."
    return 1
}

initialize_replica_set() {
    echo "Initializing replica set..."
    local host="localhost"
    mongosh --quiet --eval "
        rs.initiate({
            _id: '$MONGO_REPLICA_SET_NAME',
            members: [{ _id: 0, host: '$host:$MONGO_PORT' }]
        })
    "
}

wait_for_primary() {
    echo "Waiting for replica set to become PRIMARY..."
    for i in $(seq 1 $MAX_ATTEMPTS); do
        if [ "$1" = "auth" ]; then
            status=$(mongosh admin --quiet --eval "db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD'); rs.status().myState")
        else
            status=$(mongosh --quiet --eval "rs.status().myState")
        fi
        if [ "$status" = "1" ]; then
            echo "Replica set is now PRIMARY."
            return 0
        fi
        echo "Attempt $i: Replica set is not PRIMARY yet, retrying in $RETRY_INTERVAL seconds..."
        sleep $RETRY_INTERVAL
    done
    echo "Replica set did not become PRIMARY within the expected time."
    return 1
}

create_root_user() {
    echo "Creating root user..."
    mongosh admin --quiet --eval "
        db.createUser({
            user: '$MONGO_INITDB_ROOT_USERNAME',
            pwd: '$MONGO_INITDB_ROOT_PASSWORD',
            roles: ['root']
        });
    "
}

start_mongo_auth() {
    echo "Starting MongoDB with authentication..."
    mongod --auth --replSet "$MONGO_REPLICA_SET_NAME" --bind_ip_all --dbpath "$MONGO_DB_PATH" --logpath "$MONGO_LOG" --keyFile "$MONGO_KEYFILE" --fork
}

start_mongo_auth_foreground() {
    echo "Starting MongoDB with authentication in the foreground..."
    exec mongod --auth --replSet "$MONGO_REPLICA_SET_NAME" --bind_ip_all --dbpath "$MONGO_DB_PATH" --keyFile "$MONGO_KEYFILE"
}

if [ -f "$SETUP_COMPLETE_FILE" ]; then
    echo "Setup already completed. Starting MongoDB in foreground mode."
    start_mongo_auth_foreground
    exit 0
fi

# Main execution flow
echo "Starting MongoDB setup..."

start_mongo_noauth
wait_for_mongo || exit 1

echo "Initializing replica set..."
initialize_replica_set
wait_for_primary || exit 1

echo "Creating root user..."
create_root_user

echo "Shutting down MongoDB to restart with authentication..."
mongod --shutdown

echo "Starting MongoDB with authentication..."
start_mongo_auth
wait_for_mongo || exit 1
wait_for_primary "auth" || exit 1

# Mark setup as complete
touch "$SETUP_COMPLETE_FILE"

echo "MongoDB setup completed successfully. Starting MongoDB in foreground mode."
start_mongo_auth_foreground