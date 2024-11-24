#!/bin/bash
npm version minor
git push

cd ..
npm run install
npm run build

 rsync -av --delete --progress ./backend/dist ubuntu@mloesch.it:/var/www/shopping-list/backend/dist
 rsync -av --delete --progress ./frontend/dist ubuntu@mloesch.it:/var/www/shopping-list/frontend/dist

ssh -t ubuntu@mloesch.it << 'EOF'
#!/bin/bash
sudo systemctl daemon-reload
sudo systemctl restart shopping-list-backend
EOF