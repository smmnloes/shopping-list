#!/bin/env bash
# Set the version type based on the argument, default to "minor"
VERSION_TYPE=${1:-minor}

npm version $VERSION_TYPE
git push

# Frontend - built locally, building it on server crashes it
cd ../frontend

pnpm install
pnpm run build:prod
 rsync -av --delete --progress ./dist ubuntu@mloesch.it:/var/www/shopping-list/frontend


# Backend - built on server
ssh -t ubuntu@mloesch.it << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping-list/backend
git pull

pnpm install
pnpm run build

sudo systemctl daemon-reload
sudo systemctl restart shopping-list-backend
npm run migration:run:prod
EOF