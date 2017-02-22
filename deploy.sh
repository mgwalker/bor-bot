#!/usr/bin/env bash

# Find our deployment key
KEY=$(ls ~/.ssh | egrep '^id_[0-9a-f]{32}$')
docker-machine create --driver generic --generic-ip-address=104.131.39.131 --generic-ssh-user=docker-deployer --generic-ssh-key=~/.ssh/$KEY deploy-target
eval $(docker-machine env deploy-target)
docker-compose up --build -d
