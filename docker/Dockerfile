FROM node:carbon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Add project files to the docker container
ADD . /usr/src/app

# Install all workspace dependencies
RUN yarn install