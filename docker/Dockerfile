FROM node:latest
LABEL maintainer="arnaud.birk@ign.fr"
LABEL version="1.0.0"

ENV http_proxy=$http_proxy
ENV https_proxy=$http_proxy
ENV NO_PROXY=api-gpao

ADD ./ /var/api

WORKDIR /var/api

RUN ls -alh

RUN npm config set http-proxy $http_proxy
RUN npm config set https-proxy $http_proxy

RUN npm install -g npm
RUN npm install supervisor -g
RUN npm install

EXPOSE 8080

ENTRYPOINT ["npm", "start"]

