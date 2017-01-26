# Sets up a new instance on Ubuntu 16.06

function install_node() {
  sudo curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
  sudo nvm install v7.4.0
  sudo nvm use v7.4.0
}

function install_mongo() {
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
  echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
  sudo apt-get -y update
  sudo apt-get install -y mongodb-org
}

if [[ test ! $(which node) ]]; then
  echo 'Installing node...'
  install_node()
fi

if [[ test ! $(which mongo) ]]; then
  install_mongo()
  sudo service mongod start
fi

if [[ test ! $(which nginx) ]]; then
  sudo apt-get -y install nginx
fi
