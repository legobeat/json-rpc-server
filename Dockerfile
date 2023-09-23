# syntax=docker/dockerfile:1

## global args
ARG NODE_VERSION=18.16.1
ARG NODE_ENV=production

FROM node:${NODE_VERSION}
USER node
SHELL [ "/bin/bash", "-cex" ]

## ENVs
ENV NODE_ENV=${NODE_ENV}

# Create app directory
WORKDIR /home/node/app

# Bundle app source
COPY --chown=node:node  . .

# Install node_modules
RUN \
  --mount=type=cache,target=/root/.cache \
  --mount=type=cache,target=/root/.npm \
  <<EOF
npm install
npm run compile
EOF

ENTRYPOINT [ "node", "dist/src/server.js" ]
