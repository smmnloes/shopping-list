#!/bin/bash

ssh -t ubuntu@3.126.86.224 << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping
git pull
# comment in as needed
# npm ci
npm run build
sudo systemctl restart shopping-list
EOF