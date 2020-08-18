FROM node:lts-alpine

WORKDIR /srv/world-of-ptr
COPY . .

RUN yarn install && \
    yarn server build

ENV NODE_ENV=production
EXPOSE 8080

ENTRYPOINT [ "node", "world-server/dist/index.js" ]
