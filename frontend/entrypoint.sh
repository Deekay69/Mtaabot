#!/bin/sh
set -e

# Verify PORT is set
if [ -z "$PORT" ]; then
    echo "PORT is not set. Defaulting to 3000."
    export PORT=3000
fi

echo "Detailed Startup Log:"
echo "Current PORT: $PORT"

# Manual substitution using envsubst
echo "Generating Nginx config..."
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Limit worker processes to 1 to prevent resource exhaustion in container
echo "Limiting worker processes..."
sed -i 's/worker_processes auto;/worker_processes 1;/g' /etc/nginx/nginx.conf
sed -i 's/worker_processes \d+;/worker_processes 1;/g' /etc/nginx/nginx.conf

echo "--- Generated Config Content ---"
cat /etc/nginx/conf.d/default.conf
echo "--------------------------------"

echo "Starting Nginx..."
exec nginx -g "daemon off;"
