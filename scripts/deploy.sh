#!/bin/bash
npm version minor
git push

# Frontend
cd ../frontend

npm install
npm run build:prod
 rsync -av --delete --progress ./dist ubuntu@mloesch.it:/var/www/shopping-list/frontend


# Backend
ssh -t ubuntu@mloesch.it << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping-list/backend
git pull

npm install
npm run build

sudo systemctl daemon-reload
sudo systemctl restart shopping-list-backend
EOF