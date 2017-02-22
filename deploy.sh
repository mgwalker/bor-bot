#!/usr/bin/env bash

# Download docker-machine
#curl -L https://github.com/docker/machine/releases/download/v0.9.0/docker-machine-`uname -s`-`uname -m` > ./docker-machine
#chmod +x ./docker-machine

# Find our deployment key
KEY=$(ls ~/.ssh | egrep '^id_[0-9a-f]{32}$')

# Decrypt and unzip docker machine certs
openssl aes-256-cbc -d -in docker-certs -k DOCKER_CERTS_KEY > docker-certs.zip
unzip docker-certs.zip -d certs

# Add remote docker host
#./docker-machine create --driver generic --generic-ip-address=104.131.39.131 --generic-ssh-user=docker-deployer --generic-ssh-key=/home/ubuntu/.ssh/$KEY deploy-target
#eval $(./docker-machine env deploy-target)

export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://104.131.39.131:2376"
export DOCKER_CERT_PATH="/home/ubuntu/certs"
export DOCKER_MACHINE_NAME="darkcooger.net"

# Go!
docker-compose -f docker-compose.production.yaml up --build -d
