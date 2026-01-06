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

echo "--- Generated Config Content ---"
cat /etc/nginx/conf.d/default.conf
echo "--------------------------------"

echo "Starting Nginx..."
exec nginx -g "daemon off;"
