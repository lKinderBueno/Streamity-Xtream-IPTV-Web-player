# base image
FROM node:16 as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

# add app
COPY . /app

RUN npm run build


# php

FROM php:7.4-apache

# copy artifact build from the 'build environment'
COPY --from=build /app/build /var/www/html/

WORKDIR /var/www/html/

EXPOSE 80
