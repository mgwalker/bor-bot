#!/usr/bin/env bash

curl -L https://github.com/docker/machine/releases/download/v0.9.0/docker-machine-`uname -s`-`uname -m` > ./docker-machine
chmod +x ./docker-machine

# Find our deployment key
KEY=$(ls ~/.ssh | egrep '^id_[0-9a-f]{32}$')
./docker-machine create --driver generic --generic-ip-address=104.131.39.131 --generic-ssh-user=docker-deployer --generic-ssh-key=/home/ubuntu/.ssh/$KEY deploy-target
eval $(./docker-machine env deploy-target)
docker-compose -f docker-compose.production.yaml up --build -d
