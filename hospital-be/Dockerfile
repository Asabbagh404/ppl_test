FROM node:16.3.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

EXPOSE 7200

CMD ["node", "index.js"]
