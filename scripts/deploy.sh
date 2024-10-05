#!/bin/bash

ssh -t ubuntu@18.199.97.246 << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping-list
git pull
# comment in as needed
npm run install
npm run build
# sudo systemctl restart shopping-list
EOF