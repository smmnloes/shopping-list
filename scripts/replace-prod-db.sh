# make a backup of the current prod db
ssh ubuntu@mloesch.it 'cd /var/www/shopping-list/backend/db && cp dbfile dbfile.backup-$(date +%d-%m-%y-%T)'
# copy the local file to remote host (careful!)
scp /mnt/c/Users/Max/Coding/Repos/sqlite-db/prod-db/dbfile ubuntu@mloesch.it:/var/www/shopping-list/backend/db