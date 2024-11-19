#!/bin/bash
npm version minor
git push

ssh -t ubuntu@mloesch.it << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping-list
git pull

npm run install
npm run build

sudo systemctl daemon-reload
sudo systemctl restart shopping-list-backend
EOF