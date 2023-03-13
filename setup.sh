#!/bin/bash
#Run Command: chmod +x setup.sh

# Formating Varibles
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
BLUE="\e[34m"
UNSET="\e[0m"

# Install Git
if ! command -v git &> /dev/null; then
    echo -e "${BLUE}Installing Git...${UNSET}"
    sudo apt-get update
    sudo apt-get install -y git
    echo -e "${GREEN}Git installed.${UNSET}"
else
    echo -e "${YELLOW}Git already installed.${UNSET}"
fi

# Set up Git with your name and email
echo -e "${BLUE}Setting up Git with your name and email...${UNSET}"
read -p "Enter your name for Git: " git_name
read -p "Enter your email for Git: " git_email
git config --global user.name "${git_name}"
git config --global user.email "${git_email}"
echo -e "${GREEN}Git set up with your name and email.${UNSET}"

# Install Node.js and npm
if ! command -v node &> /dev/null; then
    echo -e "${BLUE}Installing Node.js and npm...${UNSET}"
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js and npm installed.${UNSET}"
else
    echo -e "${YELLOW}Node.js and npm already installed.${UNSET}"
fi

# Install MongoDB
if ! command -v mongo &> /dev/null; then
    echo -e "${BLUE}Installing MongoDB...${UNSET}"
    sudo apt-get update
    sudo apt-get install -y mongodb
    echo -e "${GREEN}MongoDB installed.${UNSET}"
else
    echo -e "${YELLOW}MongoDB already installed.${UNSET}"
fi

# Install React
if ! command -v create-react-app &> /dev/null; then
    echo -e "${BLUE}Installing create-react-app...${UNSET}"
    sudo npm install -g create-react-app
    echo -e "${GREEN}create-react-app installed.${UNSET}"
else
    echo -e "${YELLOW}create-react-app already installed.${UNSET}"
fi

# Clone Git repository
if [ ! -d "Quotes-and-Budgets-Website" ]; then
    echo -e "${BLUE}Cloning Git repository...${UNSET}"
    git clone https://github.com/Callum675/Quotes-and-Budgets-Website.git
    echo -e "${GREEN}Git repository cloned.${UNSET}"
else
    echo -e "${YELLOW}Git repository already cloned.${UNSET}"
fi

# Create .env file for server
if [ ! -f server/.env ]; then
    echo -e "${BLUE}Creating .env file...${UNSET}"
    touch server/.env
    echo "PORT=5000" >> server/.env
    echo "HOST=localhost" >> server/.env
    echo "DB_URL=mongodb://localhost:27017/quote" >> server/.env
    echo "ACCESS_TOKEN_SECRET=Rj2S?RVe9[]8-dCS6A**&b5Tsg\$gwbg~Bd{\*QTK" >> server/.env
    echo -e "${GREEN}.env file created.${UNSET}"
else
    echo -e "${YELLOW}.env file already exists.${UNSET}"
fi

# Start MongoDB
if ! pgrep mongod &> /dev/null; then
    echo -e "${BLUE}Starting MongoDB...${UNSET}"
    sudo systemctl start mongodb
    echo -e "${GREEN}MongoDB started.${UNSET}"
else
    echo -e "${YELLOW}MongoDB already running.${UNSET}"
fi

# Install Dependencies
echo -e "${BLUE}Installing Dependencies...${UNSET}"
npm run install-all

# Start MERN Application
echo -e "${BLUE}Starting Quotes and Budgets Application...${UNSET}"
npm run dev

# All done
echo -e "${GREEN}✅ Setup success${UNSET}"