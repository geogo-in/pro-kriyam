#!/bin/sh
 
echo "window._env_={PRODUCTION_API_ENDPOINT: '${PRODUCTION_API_ENDPOINT}' ,PRODUCTION_URL: '${PRODUCTION_URL}' }" > /usr/share/nginx/html/env-config.js

exec "$@"