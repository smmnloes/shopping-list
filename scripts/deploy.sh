#!/bin/bash

ssh -t ubuntu@3.73.126.153 << 'EOF'
#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

cd /var/www/shopping-list
git pull
# comment in as needed
npm run ci
npm run build
# sudo systemctl restart shopping-list
EOF