FROM node:16-alpine as build

WORKDIR /project

COPY package.json yarn.lock .yarn .yarnrc.yml .
COPY .yarn .yarn
COPY apps/siscad-api/package.json apps/siscad-api/package.json
COPY libs/shared/ libs/shared/

RUN yarn install

COPY apps/siscad-api/ apps/siscad-api/

FROM node:16-alpine as dev

COPY --from="build" /project /project

WORKDIR /project

EXPOSE 3001

CMD [ "yarn", "siscad-api:dev" ]
