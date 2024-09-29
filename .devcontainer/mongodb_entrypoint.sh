#!/bin/bash
set -e
set -x  # Enable debug mode for logging each command

echo "Hostname: $(hostname)"

# Environment Variables with Defaults
MONGO_LOG="/var/log/mongodb/mongod.log"
MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME:-"root"}
MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD:-"rootpassword"}
MONGO_REPLICA_SET_NAME=${MONGO_REPLICA_SET_NAME:-"rs0"}
MONGO_BIND_IP=${MONGO_BIND_IP:-"0.0.0.0"}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_KEYFILE=${MONGO_KEYFILE:-"/tmp/replica.key"}
MONGO_DB_PATH=${MONGO_DB_PATH:-"/data/db"}

start_mongo_noauth() {
  echo "Starting MongoDB without authentication..."
  mongod --replSet "$MONGO_REPLICA_SET_NAME" --bind_ip_all --dbpath "$MONGO_DB_PATH" --logpath "$MONGO_LOG" --fork
}

start_mongo_auth_foreground() {
  echo "Starting MongoDB with authentication in the foreground..."
  exec mongod --auth --replSet "$MONGO_REPLICA_SET_NAME" --bind_ip_all --dbpath "$MONGO_DB_PATH" --keyFile "$MONGO_KEYFILE"
}

stop_mongo() {
  echo "Stopping MongoDB..."
  mongosh --quiet --eval 'db.getSiblingDB("admin").shutdownServer({ force: true });' || true
  sleep 5
}

wait_for_mongo() {
  echo "Waiting for MongoDB to be ready..."
  until mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; do
    echo "MongoDB not ready yet, retrying..."
    sleep 2
  done
  echo "MongoDB is ready."
}

create_root_user() {
  echo "Creating root user if it does not exist..."
  mongosh --quiet --eval "
    const adminDb = db.getSiblingDB('admin');
    if (!adminDb.getUser('$MONGO_INITDB_ROOT_USERNAME')) {
      adminDb.createUser({
        user: '$MONGO_INITDB_ROOT_USERNAME',
        pwd: '$MONGO_INITDB_ROOT_PASSWORD',
        roles: [{ role: 'root', db: 'admin' }]
      });
      print('Root user created.');
    } else {
      print('Root user already exists.');
    }
  "
}

initialize_replica_set() {
  echo "Initializing replica set..."
  mongosh --quiet --eval "
    const status = rs.status();
    if (status.codeName === 'NotYetInitialized') {
      rs.initiate({
        _id: '$MONGO_REPLICA_SET_NAME',
        members: [{ _id: 0, host: 'localhost:$MONGO_PORT' }]
      });
      print('Replica set initialized.');
    } else {
      print('Replica set already initialized.');
    }
  "
}

wait_for_primary() {
  echo "Waiting for replica set to become PRIMARY..."
  until mongosh --quiet --eval 'db.isMaster().ismaster' | grep -q 'true'; do
    echo "Replica set is not PRIMARY yet, retrying..."
    sleep 2
  done
  echo "Replica set is now PRIMARY."
}

# Main Execution Flow
echo "Starting MongoDB setup..."

# Start MongoDB without authentication
start_mongo_noauth
wait_for_mongo

# Initialize the replica set
initialize_replica_set
wait_for_primary

# Create the root user
create_root_user

# Restart MongoDB with authentication
stop_mongo
start_mongo_auth_foreground
