FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock rollup.config.js ./

RUN yarn

COPY src ./src

COPY public ./public

RUN yarn build

EXPOSE 5000
ENV host=0.0.0.0

CMD ["yarn", "start"]