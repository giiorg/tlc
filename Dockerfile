FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock tsconfig.json .env start.sh ./
COPY src ./src

RUN yarn install --frozen-lockfile --no-cache
RUN yarn build

RUN ["node", "/app/dist/setup.js"]

EXPOSE 8001

CMD ["node", "/app/dist/app.js"]