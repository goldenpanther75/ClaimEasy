curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs
sudo npm install -g pm2
mkdir -p ~/app
tar -xzf backend_mumbai.tar.gz -C ~/app
cd ~/app/server
npm install
export EMAIL_USER="goldenpanther75@gmail.com"
export EMAIL_PASS="ejgbiohvsbwflwxm"
pm2 start index.js --name claimeasy-backend
pm2 save
