#!/bin/bash
#Run Command: chmod +x setup.sh

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

# Install Git
if ! command -v git &> /dev/null; then
    echo -e "${BLUE}Installing Git...${UNSET}"
    sudo apt-get update || { echo -e "${RED}Failed to update packages.${UNSET}"; exit 1; }
    sudo apt-get install -y git || { echo -e "${RED}Failed to install Git.${UNSET}"; exit 1; }
    echo -e "${GREEN}Git installed.${UNSET}"
else
    echo -e "${YELLOW}Git already installed.${UNSET}"
fi

# Set up Git with your name and email
echo -e "${BLUE}Setting up Git with your name and email...${UNSET}"
read -p "Enter your name for Git: " git_name
while [[ ! $git_name =~ ^[a-zA-Z]+$ ]]; do
    echo -e "${RED}Error: Please enter a valid name.${UNSET}"
    read -p "Enter your name for Git: " git_name
done
read -p "Enter your email for Git: " git_email
while [[ ! $git_email =~ ^[^\s@]+@[^\s@]+\.[^\s@]+$ ]]; do
    echo -e "${RED}Error: Please enter a valid email address.${UNSET}"
    read -p "Enter your email for Git: " git_email
done
git config --global user.name "${git_name}" || { echo -e "${RED}Failed to set Git username.${UNSET}"; exit 1; }
git config --global user.email "${git_email}" || { echo -e "${RED}Failed to set Git email.${UNSET}"; exit 1; }
echo -e "${GREEN}Git set up with your name and email.${UNSET}"

# Install Node.js and npm
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}Installing Node.js and npm...${UNSET}"
    if ! curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -; then
        echo -e "${RED}Failed to add Node.js repository.${UNSET}"
        exit 1
    fi
    sudo apt-get install -y nodejs || { echo -e "${RED}Failed to install Node.js and npm.${UNSET}"; exit 1; }
    echo -e "${GREEN}Node.js and npm installed.${UNSET}"
else
    echo -e "${YELLOW}Node.js and npm already installed.${UNSET}"
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
        sudo apt-get install -y mongodb || { echo -e "${RED}Failed to install MongoDB.${UNSET}"; exit 1; }
        echo -e "${GREEN}MongoDB installed.${UNSET}"
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
    echo -e "OpenSSL already installed.${UNSET}"
fi


# Clone Git repository
if [ ! -d "Quotes-and-Budgets-Website" ]; then
    echo -e "${BLUE}Cloning Git repository...${UNSET}"
    git clone https://github.com/Callum675/Quotes-and-Budgets-Website.git
    echo -e "${GREEN}Git repository cloned.${UNSET}"
else
    echo -e "${YELLOW}Git repository already cloned.${UNSET}"
fi

# Check if the Git clone was successful
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to clone Git repository.${UNSET}"
    exit 1
fi

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

# Start MongoDB
if ! pgrep mongod &> /dev/null; then
    echo -e "${BLUE}Starting MongoDB...${UNSET}"
    sudo systemctl start mongodb
    echo -e "${GREEN}MongoDB started.${UNSET}"
else
    echo -e "${YELLOW}MongoDB already running.${UNSET}"
fi

# Check if MongoDB was started successfully
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start MongoDB.${UNSET}"
    exit 1
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

#Create Users using Curl

# All done
echo -e "${GREEN}✅ Setup successful${UNSET}"