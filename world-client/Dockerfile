FROM node:lts-alpine AS build-env

WORKDIR /src
COPY . .

ARG WOP_HOST=wss://world-server.ptr.si
RUN yarn install && \
    NODE_ENV=production yarn build

FROM nginx:alpine
COPY --from=build-env /src/dist/ /usr/share/nginx/html
