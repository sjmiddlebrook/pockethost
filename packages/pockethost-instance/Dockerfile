FROM node:20-alpine3.18 

RUN apk update
RUN apk add --no-cache ca-certificates bash

RUN adduser -D pockethost

RUN echo "pockethost:password" | chpasswd

# BEGIN_PB
WORKDIR /.pbincache
COPY ./.pbincache/0.22.12/x64/linux/pocketbase 0.22.12/pocketbase
COPY ./.pbincache/0.22.11/x64/linux/pocketbase 0.22.11/pocketbase
COPY ./.pbincache/0.22.10/x64/linux/pocketbase 0.22.10/pocketbase
COPY ./.pbincache/0.22.9/x64/linux/pocketbase 0.22.9/pocketbase
COPY ./.pbincache/0.22.8/x64/linux/pocketbase 0.22.8/pocketbase
COPY ./.pbincache/0.22.7/x64/linux/pocketbase 0.22.7/pocketbase
COPY ./.pbincache/0.22.6/x64/linux/pocketbase 0.22.6/pocketbase
COPY ./.pbincache/0.22.5/x64/linux/pocketbase 0.22.5/pocketbase
COPY ./.pbincache/0.22.4/x64/linux/pocketbase 0.22.4/pocketbase
COPY ./.pbincache/0.22.3/x64/linux/pocketbase 0.22.3/pocketbase
COPY ./.pbincache/0.22.2/x64/linux/pocketbase 0.22.2/pocketbase
COPY ./.pbincache/0.22.1/x64/linux/pocketbase 0.22.1/pocketbase
COPY ./.pbincache/0.22.0/x64/linux/pocketbase 0.22.0/pocketbase
COPY ./.pbincache/0.21.3/x64/linux/pocketbase 0.21.3/pocketbase
COPY ./.pbincache/0.21.2/x64/linux/pocketbase 0.21.2/pocketbase
COPY ./.pbincache/0.21.1/x64/linux/pocketbase 0.21.1/pocketbase
COPY ./.pbincache/0.21.0/x64/linux/pocketbase 0.21.0/pocketbase
COPY ./.pbincache/0.20.7/x64/linux/pocketbase 0.20.7/pocketbase
COPY ./.pbincache/0.20.6/x64/linux/pocketbase 0.20.6/pocketbase
COPY ./.pbincache/0.20.5/x64/linux/pocketbase 0.20.5/pocketbase
COPY ./.pbincache/0.20.4/x64/linux/pocketbase 0.20.4/pocketbase
COPY ./.pbincache/0.20.3/x64/linux/pocketbase 0.20.3/pocketbase
COPY ./.pbincache/0.20.2/x64/linux/pocketbase 0.20.2/pocketbase
COPY ./.pbincache/0.20.1/x64/linux/pocketbase 0.20.1/pocketbase
COPY ./.pbincache/0.20.0/x64/linux/pocketbase 0.20.0/pocketbase
COPY ./.pbincache/0.20.0-rc3/x64/linux/pocketbase 0.20.0-rc3/pocketbase
COPY ./.pbincache/0.20.0-rc2/x64/linux/pocketbase 0.20.0-rc2/pocketbase
COPY ./.pbincache/0.20.0-rc/x64/linux/pocketbase 0.20.0-rc/pocketbase
COPY ./.pbincache/0.19.4/x64/linux/pocketbase 0.19.4/pocketbase
COPY ./.pbincache/0.19.3/x64/linux/pocketbase 0.19.3/pocketbase
COPY ./.pbincache/0.19.2/x64/linux/pocketbase 0.19.2/pocketbase
COPY ./.pbincache/0.19.1/x64/linux/pocketbase 0.19.1/pocketbase
COPY ./.pbincache/0.19.0/x64/linux/pocketbase 0.19.0/pocketbase
COPY ./.pbincache/0.18.10/x64/linux/pocketbase 0.18.10/pocketbase
COPY ./.pbincache/0.18.9/x64/linux/pocketbase 0.18.9/pocketbase
COPY ./.pbincache/0.18.8/x64/linux/pocketbase 0.18.8/pocketbase
COPY ./.pbincache/0.18.7/x64/linux/pocketbase 0.18.7/pocketbase
COPY ./.pbincache/0.18.6/x64/linux/pocketbase 0.18.6/pocketbase
COPY ./.pbincache/0.18.5/x64/linux/pocketbase 0.18.5/pocketbase
COPY ./.pbincache/0.18.4/x64/linux/pocketbase 0.18.4/pocketbase
COPY ./.pbincache/0.18.3/x64/linux/pocketbase 0.18.3/pocketbase
COPY ./.pbincache/0.18.2/x64/linux/pocketbase 0.18.2/pocketbase
COPY ./.pbincache/0.18.1/x64/linux/pocketbase 0.18.1/pocketbase
COPY ./.pbincache/0.18.0/x64/linux/pocketbase 0.18.0/pocketbase
COPY ./.pbincache/0.17.7/x64/linux/pocketbase 0.17.7/pocketbase
COPY ./.pbincache/0.17.6/x64/linux/pocketbase 0.17.6/pocketbase
COPY ./.pbincache/0.17.5/x64/linux/pocketbase 0.17.5/pocketbase
COPY ./.pbincache/0.17.4/x64/linux/pocketbase 0.17.4/pocketbase
COPY ./.pbincache/0.17.3/x64/linux/pocketbase 0.17.3/pocketbase
COPY ./.pbincache/0.17.2/x64/linux/pocketbase 0.17.2/pocketbase
COPY ./.pbincache/0.17.1/x64/linux/pocketbase 0.17.1/pocketbase
COPY ./.pbincache/0.17.0/x64/linux/pocketbase 0.17.0/pocketbase
COPY ./.pbincache/0.16.10/x64/linux/pocketbase 0.16.10/pocketbase
COPY ./.pbincache/0.16.9/x64/linux/pocketbase 0.16.9/pocketbase
COPY ./.pbincache/0.16.8/x64/linux/pocketbase 0.16.8/pocketbase
COPY ./.pbincache/0.16.7/x64/linux/pocketbase 0.16.7/pocketbase
COPY ./.pbincache/0.16.6/x64/linux/pocketbase 0.16.6/pocketbase
COPY ./.pbincache/0.16.5/x64/linux/pocketbase 0.16.5/pocketbase
COPY ./.pbincache/0.16.4/x64/linux/pocketbase 0.16.4/pocketbase
COPY ./.pbincache/0.16.3/x64/linux/pocketbase 0.16.3/pocketbase
COPY ./.pbincache/0.16.2/x64/linux/pocketbase 0.16.2/pocketbase
COPY ./.pbincache/0.16.1/x64/linux/pocketbase 0.16.1/pocketbase
COPY ./.pbincache/0.16.0/x64/linux/pocketbase 0.16.0/pocketbase
COPY ./.pbincache/0.15.3/x64/linux/pocketbase 0.15.3/pocketbase
COPY ./.pbincache/0.15.2/x64/linux/pocketbase 0.15.2/pocketbase
COPY ./.pbincache/0.15.1/x64/linux/pocketbase 0.15.1/pocketbase
COPY ./.pbincache/0.15.0/x64/linux/pocketbase 0.15.0/pocketbase
COPY ./.pbincache/0.14.5/x64/linux/pocketbase 0.14.5/pocketbase
COPY ./.pbincache/0.14.4/x64/linux/pocketbase 0.14.4/pocketbase
COPY ./.pbincache/0.14.3/x64/linux/pocketbase 0.14.3/pocketbase
COPY ./.pbincache/0.14.2/x64/linux/pocketbase 0.14.2/pocketbase
COPY ./.pbincache/0.14.1/x64/linux/pocketbase 0.14.1/pocketbase
COPY ./.pbincache/0.14.0/x64/linux/pocketbase 0.14.0/pocketbase
COPY ./.pbincache/0.13.4/x64/linux/pocketbase 0.13.4/pocketbase
COPY ./.pbincache/0.13.3/x64/linux/pocketbase 0.13.3/pocketbase
COPY ./.pbincache/0.13.2/x64/linux/pocketbase 0.13.2/pocketbase
COPY ./.pbincache/0.13.1/x64/linux/pocketbase 0.13.1/pocketbase
COPY ./.pbincache/0.13.0/x64/linux/pocketbase 0.13.0/pocketbase
COPY ./.pbincache/0.12.3/x64/linux/pocketbase 0.12.3/pocketbase
COPY ./.pbincache/0.12.2/x64/linux/pocketbase 0.12.2/pocketbase
COPY ./.pbincache/0.12.1/x64/linux/pocketbase 0.12.1/pocketbase
COPY ./.pbincache/0.12.0/x64/linux/pocketbase 0.12.0/pocketbase
COPY ./.pbincache/0.11.4/x64/linux/pocketbase 0.11.4/pocketbase
COPY ./.pbincache/0.11.3/x64/linux/pocketbase 0.11.3/pocketbase
COPY ./.pbincache/0.11.2/x64/linux/pocketbase 0.11.2/pocketbase
COPY ./.pbincache/0.11.1/x64/linux/pocketbase 0.11.1/pocketbase
COPY ./.pbincache/0.11.0/x64/linux/pocketbase 0.11.0/pocketbase
COPY ./.pbincache/0.10.4/x64/linux/pocketbase 0.10.4/pocketbase
COPY ./.pbincache/0.10.3/x64/linux/pocketbase 0.10.3/pocketbase
COPY ./.pbincache/0.10.2/x64/linux/pocketbase 0.10.2/pocketbase
COPY ./.pbincache/0.10.1/x64/linux/pocketbase 0.10.1/pocketbase
COPY ./.pbincache/0.10.0/x64/linux/pocketbase 0.10.0/pocketbase
COPY ./.pbincache/0.9.2/x64/linux/pocketbase 0.9.2/pocketbase
COPY ./.pbincache/0.9.1/x64/linux/pocketbase 0.9.1/pocketbase
COPY ./.pbincache/0.9.0/x64/linux/pocketbase 0.9.0/pocketbase
COPY ./.pbincache/0.8.0/x64/linux/pocketbase 0.8.0/pocketbase
COPY ./.pbincache/0.8.0-rc4/x64/linux/pocketbase 0.8.0-rc4/pocketbase
COPY ./.pbincache/0.8.0-rc3/x64/linux/pocketbase 0.8.0-rc3/pocketbase
COPY ./.pbincache/0.8.0-rc2/x64/linux/pocketbase 0.8.0-rc2/pocketbase
COPY ./.pbincache/0.8.0-rc1/x64/linux/pocketbase 0.8.0-rc1/pocketbase
COPY ./.pbincache/0.7.10/x64/linux/pocketbase 0.7.10/pocketbase
COPY ./.pbincache/0.7.9/x64/linux/pocketbase 0.7.9/pocketbase
COPY ./.pbincache/0.7.8/x64/linux/pocketbase 0.7.8/pocketbase
COPY ./.pbincache/0.7.7/x64/linux/pocketbase 0.7.7/pocketbase
COPY ./.pbincache/0.7.6/x64/linux/pocketbase 0.7.6/pocketbase
COPY ./.pbincache/0.7.5/x64/linux/pocketbase 0.7.5/pocketbase
COPY ./.pbincache/0.7.4/x64/linux/pocketbase 0.7.4/pocketbase
COPY ./.pbincache/0.7.3/x64/linux/pocketbase 0.7.3/pocketbase
COPY ./.pbincache/0.7.2/x64/linux/pocketbase 0.7.2/pocketbase
COPY ./.pbincache/0.7.1/x64/linux/pocketbase 0.7.1/pocketbase
COPY ./.pbincache/0.7.0/x64/linux/pocketbase 0.7.0/pocketbase
COPY ./.pbincache/0.6.0/x64/linux/pocketbase 0.6.0/pocketbase
COPY ./.pbincache/0.5.2/x64/linux/pocketbase 0.5.2/pocketbase
COPY ./.pbincache/0.5.1/x64/linux/pocketbase 0.5.1/pocketbase
COPY ./.pbincache/0.5.0/x64/linux/pocketbase 0.5.0/pocketbase
COPY ./.pbincache/0.4.2/x64/linux/pocketbase 0.4.2/pocketbase
COPY ./.pbincache/0.4.1/x64/linux/pocketbase 0.4.1/pocketbase
COPY ./.pbincache/0.4.0/x64/linux/pocketbase 0.4.0/pocketbase
COPY ./.pbincache/0.3.4/x64/linux/pocketbase 0.3.4/pocketbase
COPY ./.pbincache/0.3.3/x64/linux/pocketbase 0.3.3/pocketbase
COPY ./.pbincache/0.3.2/x64/linux/pocketbase 0.3.2/pocketbase
COPY ./.pbincache/0.3.1/x64/linux/pocketbase 0.3.1/pocketbase
COPY ./.pbincache/0.3.0/x64/linux/pocketbase 0.3.0/pocketbase
COPY ./.pbincache/0.2.8/x64/linux/pocketbase 0.2.8/pocketbase
COPY ./.pbincache/0.2.7/x64/linux/pocketbase 0.2.7/pocketbase
COPY ./.pbincache/0.2.6/x64/linux/pocketbase 0.2.6/pocketbase
COPY ./.pbincache/0.2.5/x64/linux/pocketbase 0.2.5/pocketbase
COPY ./.pbincache/0.2.4/x64/linux/pocketbase 0.2.4/pocketbase
COPY ./.pbincache/0.2.3/x64/linux/pocketbase 0.2.3/pocketbase
COPY ./.pbincache/0.2.2/x64/linux/pocketbase 0.2.2/pocketbase
COPY ./.pbincache/0.2.1/x64/linux/pocketbase 0.2.1/pocketbase
COPY ./.pbincache/0.2.0/x64/linux/pocketbase 0.2.0/pocketbase
COPY ./.pbincache/0.1.2/x64/linux/pocketbase 0.1.2/pocketbase
COPY ./.pbincache/0.1.1/x64/linux/pocketbase 0.1.1/pocketbase
COPY ./.pbincache/0.1.0/x64/linux/pocketbase 0.1.0/pocketbase
# END_PB

WORKDIR /bin
COPY pocketbase-shim.sh pocketbase
RUN chmod +x pocketbase

EXPOSE 8090

WORKDIR /bootstrap

COPY bootstrap/* .

RUN npm i

WORKDIR /home/pockethost
