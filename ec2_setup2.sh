#!/bin/bash
export PATH=$PATH:/usr/bin
cd server
npm install
sudo npm install -g pm2
pm2 start index.js --name "claimeasy-backend"
pm2 save
sudo env PATH=$PATH:/usr/bin $(which pm2) startup systemd -u ec2-user --hp /home/ec2-user
