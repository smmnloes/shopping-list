#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping
git pull
npm ci
npm run build
echo APP_SECRET=$PROD_SECRET >> .env.production
npm run start:prod