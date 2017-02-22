#!/usr/bin/env bash

# Decrypt and unzip docker machine certs
unzip deploy

# Add remote docker host
#./docker-machine create --driver generic --generic-ip-address=104.131.39.131 --generic-ssh-user=docker-deployer --generic-ssh-key=/home/ubuntu/.ssh/$KEY deploy-target
#eval $(./docker-machine env deploy-target)

export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://104.131.39.131:2376"
export DOCKER_CERT_PATH="/home/ubuntu/$CIRCLE_PROJECT_REPONAME/certs"
export DOCKER_MACHINE_NAME="darkcooger.net"

# Go!
docker-compose -f docker-compose.production.yaml up --build -d
