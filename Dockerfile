# syntax=docker/dockerfile:1

## global args
ARG NODE_VERSION=18.16.1
ARG NODE_ENV=production

FROM node:${NODE_VERSION}
SHELL [ "/bin/bash", "-cex" ]

## ENVs
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY . .

RUN npm install; \
  npm install pm2 -g; \
  npm run compile

ENV NO_OF_RPC_SERVERS=1

ENTRYPOINT [ "/app/entrypoint.sh" ]
