FROM node:12-alpine

WORKDIR /api

COPY package.json yarn.lock ./

RUN yarn

COPY . .

CMD [ "yarn", "start" ]
