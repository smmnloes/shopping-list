#!/bin/env bash
# Set the version type based on the argument, default to "minor", 'no_update' skips the version bump
VERSION_TYPE=${1:-minor}

if [ "$VERSION_TYPE" != "no_update" ]; then
    npm version $VERSION_TYPE
    git push
fi

# Frontend - built locally, building it on server crashes it
cd ../frontend

pnpm install
pnpm run build:prod
 cd dist
 cp index.html index-shopping.html
 sed -i 's/<title>/Einkaufsliste/g' index-shopping.html
 cp index.html index-shares.html
  sed -i 's/<title>/Dateifreigabe/g' index-shares.html
  rm index.html
 rsync -av --delete --progress . ubuntu@mloesch.it:/var/www/shopping-list/frontend/dist


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