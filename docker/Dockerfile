#Pulling latest version of node
FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/mira-kit
WORKDIR /usr/src/mira-kit

# Add project files to the docker container
ADD . /usr/src/mira-kit

RUN npm install

#Exposing default port
EXPOSE 3000
