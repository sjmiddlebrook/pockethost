FROM node:20-alpine3.18 

RUN apk update
RUN apk add --no-cache ca-certificates bash

RUN adduser -D pockethost

RUN echo "pockethost:password" | chpasswd

WORKDIR /

COPY .pbincache .pbincache

WORKDIR /bin
COPY pocketbase-shim.sh pocketbase
RUN chmod +x pocketbase

EXPOSE 8090

WORKDIR /bootstrap

COPY bootstrap/* .

RUN npm i

WORKDIR /home/pockethost
