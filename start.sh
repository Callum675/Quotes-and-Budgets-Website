#!/bin/bash
#Give Execute Permission: chmod +x start.sh
#Run Command: ./start.sh

# Formating Varibles
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
BLUE="\e[34m"
UNSET="\e[0m"

# Key Output
echo -e "${GREEN}Success!${UNSET}"
echo -e "${YELLOW}Warning!${UNSET}"
echo -e "${RED}Error!${UNSET}"
echo -e "${BLUE}Information!${UNSET}"

# Check for sudo privileges
if [[ $(id -Gn | grep -c '\bsudo\b') -eq 0 ]]; then
  echo -e "${RED}This script must be run with sudo privileges.${UNSET}"
  exit 1
fi

# Check if MongoDB is already installed
if command -v mongod &> /dev/null; then
    echo -e "${YELLOW}MongoDB already installed.${UNSET}"
else
    # Check if MongoDB is running
    if pgrep mongod &> /dev/null; then
        echo -e "${YELLOW}MongoDB is already running.${UNSET}"
    else
        # Install MongoDB
        echo -e "${BLUE}Installing MongoDB...${UNSET}"

        # Import the MongoDB public GPG key
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

        # Create a list file for MongoDB
        echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

        # Reload the local package database
        sudo apt-get update

        # Install the MongoDB Community Edition
        sudo apt-get install -y mongodb-org || { echo -e "${RED}Failed to install MongoDB.${UNSET}"; exit 1; }

        # Start MongoDB
        sudo systemctl start mongod

        echo -e "${GREEN}MongoDB installed and started.${UNSET}"
    fi
fi

# Install Dependencies
echo -e "${BLUE}Installing Dependencies...${UNSET}"
npm run install-all

# Check if the dependency installation was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install dependencies.${UNSET}"
    exit 1
else
    echo -e "${GREEN}Installed all dependencies.${GREEN}"
fi

# Start MERN Application
echo -e "${BLUE}Starting Quotes and Budgets Application...${UNSET}"
npm run dev

# Check if the application was started successfully
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start Quotes and Budgets Application.${UNSET}"
    exit 1
fi

# All done
echo -e "${GREEN}✅ Setup successful${UNSET}"
