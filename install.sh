#!/bin/bash

##########################################################################
# Assuming You Have Fedora/RHEL/CentOS etc.
# May Not work on a debian distribution.
##########################################################################

# Path Setup
SCRIPT=$(realpath $0)
SCRIPTDIR=$(dirname "$SCRIPT")
pushd $SCRIPTDIR

# Package Manager for RHEL
yum update

# React Setup
pushd client
if [ ! -f /bin/npm ]
then
    echo "Installing Node.js"
    sudo yum install -y nodejs
fi
npm install
popd

# Backend things Installation
pushd Server

# MongoDb Installation
if [ ! -f /bin/mongod ]
then
    echo "Installing MongoDb"
    curl -o mongo.rpm 'https://repo.mongodb.org/yum/redhat/7/mongodb-org/5.0/x86_64/RPMS/mongodb-org-server-5.0.9-1.el7.x86_64.rpm'
    sudo yum install -y mongo.rpm
    sudo systemctl enable --now mongod
fi

# Python Installation
if [ ! -f /bin/python3.7 ]
then
    echo "Please Install Python 3.7"
    exit 1
    # if [ ! -f /bin/git ]
    # then
    #     echo "Installing git"
    #     sudo yum install -y git
    # fi
    # curl https://pyenv.run | bash
    # . ~/.bashrc
    # . /etc/profile
    # pyenv install 3.7.9
    # pyenv global 3.7.9
fi
pip install -r requirements.txt
popd
popd