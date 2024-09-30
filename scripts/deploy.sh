#!/bin/bash

# Define variables
DIST_FOLDER="../dist"
REMOTE_USER="ubuntu"
REMOTE_HOST="3.126.86.224"
REMOTE_DIR="/var/www/shopping"
SCP_OPTIONS="-r -C -o CompressionLevel=9 -o Ciphers=aes128-ctr,aes192-ctr,aes256-ctr"

# Copy the contents of the dist folder to the remote directory
scp $SCP_OPTIONS "$DIST_FOLDER"/* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# Check if the copy was successful
if [ $? -eq 0 ]; then
  echo "Files copied successfully to $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
else
  echo "Failed to copy files to $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"
fi