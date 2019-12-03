# Dockerfile for bidir dev env't Screening service
FROM node:10.15.3

MAINTAINER Teferi Assefa <teferi.assefa@gmail.com>

ADD . /usr/src/app 

WORKDIR /usr/src/app

RUN npm install

EXPOSE 8120

ENTRYPOINT ["node", "app.js"]

