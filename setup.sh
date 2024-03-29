#!/bin/bash
#Give Execute Permission: chmod +x setup.sh
#Run Command: ./setup.sh

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

# Update the system packages
echo -e "${BLUE}Updating system packages...${UNSET}"
if ! sudo apt-get update; then
  echo -e "${RED}Failed to update packages.${UNSET}"
  exit 1
fi
echo -e "${GREEN}System packages updated.${UNSET}"

# Install curl
echo -e "${BLUE}Installing curl...${UNSET}"
if ! sudo apt-get install curl; then
  echo -e "${RED}Failed to install curl.${UNSET}"
  exit 1
fi
echo -e "${GREEN}curl installed.${UNSET}"

# Install Git
if ! command -v git &> /dev/null; then
    echo -e "${BLUE}Installing Git...${UNSET}"
    sudo apt-get update || { echo -e "${RED}Failed to update packages.${UNSET}"; exit 1; }
    sudo apt-get install -y git || { echo -e "${RED}Failed to install Git.${UNSET}"; exit 1; }
    echo -e "${GREEN}Git installed.${UNSET}"
else
    echo -e "${YELLOW}Git already installed.${UNSET}"
fi

# Ask user if they would like to configure Git
read -p "Would you like to configure Git? (y/n) " configure_git

if [[ "$configure_git" == "y" ]]; then
    # Set up Git with user's name and email
    echo -e "${BLUE}Setting up Git with your name and email...${UNSET}"
    read -p "Enter your name for Git: " git_name
    while [[ ! $git_name =~ ^[a-zA-Z]+$ ]]; do
        echo -e "${RED}Error: Please enter a valid name.${UNSET}"
        read -p "Enter your name for Git: " git_name
    done
    read -p "Enter your email for Git: " git_email
    while [[ ! $git_email =~ ^([A-Za-z]+[A-Za-z0-9]*((\.|\-|\_)?[A-Za-z]+[A-Za-z0-9]*)*)@(([A-Za-z]+[A-Za-z0-9]*)+((\.|\-|\_)?([A-Za-z]+[A-Za-z0-9]*)+)*)+\.([A-Za-z]{2,})+$ ]]; do
        echo -e "${RED}Error: Please enter a valid email address.${UNSET}"
        read -p "Enter your email for Git: " git_email
    done
    git config --global user.name "${git_name}" || { echo -e "${RED}Failed to set Git username.${UNSET}"; exit 1; }
    git config --global user.email "${git_email}" || { echo -e "${RED}Failed to set Git email.${UNSET}"; exit 1; }
    echo -e "${GREEN}Git set up with your name and email.${UNSET}"
else
    echo -e "${YELLOW}Skipping Git configuration.${UNSET}"
fi

# Install Node.js & Npm
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}Installing Node.js & npm...${UNSET}"
    if ! curl -sL https://deb.nodesource.com/setup_19.x | sudo -E bash -; then
        echo -e "${RED}Failed to add Node.js repository.${UNSET}"
        exit 1
    fi
    sudo apt-get install -y nodejs || { echo -e "${RED}Failed to install Node.js.${UNSET}"; exit 1; }
    sudo apt-get install -y npm || { echo -e "${RED}Failed to install npm.${UNSET}"; exit 1; }
    echo -e "${GREEN}Node.js & npm installed.${UNSET}"
else
    echo -e "${YELLOW}Node.js & npm already installed.${UNSET}"
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

# Install openSSL
if ! command -v openssl &> /dev/null; then
    echo -e "${BLUE}Installing OpenSSL...${UNSET}"
    if sudo apt-get install -y openssl; then
        echo -e "${GREEN}OpenSSL installed.${UNSET}"
    else
        echo -e "${RED}Failed to install OpenSSL.${UNSET}"
        exit 1
    fi
else
    echo -e "${YELLOW}OpenSSL already installed.${UNSET}"
fi


# Pull Git repository
#if [ -d "Quotes-and-Budgets-Website" ]; then
#    echo -e "${BLUE}Pulling Git repository...${UNSET}"
#    git pull
#    echo -e "${GREEN}Git repository pulled.${UNSET}"
#else
#    echo -e "${RED}Error: Git repository not found.${UNSET}"
#    exit 1
#fi

# Check if the Git pull was successful
#if [ $? -ne 0 ]; then
#    echo -e "${RED}Error: Failed to pull Git repository.${UNSET}"
#    exit 1
#fi

# Create .env file for server
if [ ! -f server/.env ]; then
    echo -e "${BLUE}Creating .env file...${UNSET}"
    touch server/.env
    echo "PORT=5000" >> server/.env
    echo "HOST=localhost" >> server/.env
    echo "DB_URL=mongodb://localhost:27017/quote" >> server/.env

    # Generate a secure random string for ACCESS_TOKEN_SECRET using openssl
    ACCESS_TOKEN_SECRET=$(openssl rand -base64 32)
    echo "ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET" >> server/.env

    echo -e "${GREEN}.env file created.${UNSET}"
else
    echo -e "${YELLOW}.env file already exists.${UNSET}"
fi

# Check if the .env file creation was successful
if [ ! -f server/.env ]; then
    echo -e "${RED}Error: Failed to create .env file.${UNSET}"
    exit 1
fi

#Create Defult Users
if ! mongoimport --host localhost:27017 \
         --db quote \
         --collection users \
         --file users.json --jsonArray; then
    echo -e "${RED}Failed to create Users schema.${UNSET}"
    exit 1
fi
echo -e "${GREEN}Users Schema created.${UNSET}"

#Projects schema generation
if ! mongoimport --host localhost:27017 \
         --db quote \
         --collection projects \
         --file projects.json --jsonArray; then
    echo -e "${RED}Failed to create Projects schema.${UNSET}"
    exit 1
fi
echo -e "${GREEN}Projects Schema created.${UNSET}"

#Workers schema generation
if ! mongoimport --host localhost:27017 \
         --db quote \
         --collection workers \
         --file workers.json --jsonArray; then
    echo -e "${RED}Failed to create Workers schema.${UNSET}"
    exit 1
fi
echo -e "${GREEN}Workers Schema created.${UNSET}"

#Resources schema generation
if ! mongoimport --host localhost:27017 \
         --db quote \
         --collection resources \
         --file resources.json --jsonArray; then
    echo -e "${RED}Failed to create Resources schema.${UNSET}"
    exit 1
fi
echo -e "${GREEN}Resources Schema created.${UNSET}"

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
