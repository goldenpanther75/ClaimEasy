#!/bin/bash
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
tar -xzf server.tar.gz
cd server
npm install
sudo npm install -g pm2
pm2 start index.js --name "claimeasy-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user
