#!/bin/bash

# Update the package list and upgrade all packages
apt-get update -y
apt-get upgrade -y
apt-get install certbot python3-certbot-dns-cloudflare -y


# Create user pockethost with no password
# adduser --disabled-password --gecos "" pockethost

# Grant passwordless sudo privileges to pockethost
# echo "pockethost ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/pockethost

# Update configurations
ufw allow OpenSSH
ufw allow https
ufw allow http
ufw allow 21
ip addr
# ufw allow in on eth1 to any port 8090 # probably eth1, but check. Open ports to private IP traffic as needed
echo "y" | ufw enable

# Copy root's authorized_keys to pockethost
# mkdir -p /home/pockethost/.ssh
# cp /root/.ssh/authorized_keys /home/pockethost/.ssh/authorized_keys
# chown -R pockethost:pockethost /home/pockethost/.ssh
# chmod 700 /home/pockethost/.ssh
# chmod 600 /home/pockethost/.ssh/authorized_keys

# Add GitHub to known hosts to prevent interactive prompt
# su - pockethost -c "ssh-keyscan github.com >> ~/.ssh/known_hosts"

git config --global user.email "you@example.com"
git config --global user.name "Your Name"

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
git clone git@github.com:pockethost/pockethost.git
cd pockethost
nvm install
npm i -g pnpm pm2

# create .secret/certbot-cloudflare-dns-auth.ini (copy from another server)
chmod 600 .secret/certbot-cloudflare-dns-auth.ini
certbot certonly --dns-cloudflare --dns-cloudflare-credentials ./.secret/certbot-cloudflare-dns-auth.ini -d '*.fra-1.pockethost.io' -d 'fra-1.pockethost.io'
