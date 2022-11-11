FROM node:16-alpine as build

WORKDIR /project

COPY package.json yarn.lock .yarn .yarnrc.yml .
COPY .yarn .yarn
COPY apps/siscad-web/package.json apps/siscad-web/package.json

RUN yarn install

COPY apps/siscad-web/ apps/siscad-web/

FROM node:16-alpine as dev

COPY --from="build" /project /project

WORKDIR /project

EXPOSE 8080

CMD ["yarn", "siscad-web:dev"]