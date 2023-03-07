#!/bin/bash

# Formating Varibles
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
BLUE="\e[34m"
UNSET="\e[0m"

#install node/yarn


cd frontend
#install modules

#start server

cd server
#create .env

#install modules
npm install

#start server
yarn start

# All done
echo "✅ Setup success"