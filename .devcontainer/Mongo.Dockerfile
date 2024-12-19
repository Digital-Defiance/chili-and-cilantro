# db/Mongo.Dockerfile

FROM mongo:latest

# Generate a secure key for the replica set
RUN openssl rand -base64 756 > "/tmp/replica.key" \
  && chmod 600 /tmp/replica.key \
  && chown mongodb:mongodb /tmp/replica.key

# Remove any existing init scripts to prevent conflicts
RUN rm -rf /docker-entrypoint-initdb.d/*

# Copy the updated entrypoint script
COPY mongodb_entrypoint.sh /usr/local/bin/mongodb_entrypoint.sh
RUN chmod +x /usr/local/bin/mongodb_entrypoint.sh

COPY mongodb_healthcheck.sh /usr/local/bin/mongodb_healthcheck.sh
RUN chmod +x /usr/local/bin/mongodb_healthcheck.sh

# Override the default entrypoint
ENTRYPOINT ["/usr/local/bin/mongodb_entrypoint.sh"]

# Expose MongoDB port
EXPOSE 27017