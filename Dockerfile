FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock tsconfig.json .env ./
COPY src ./src

RUN yarn install --frozen-lockfile --no-cache
RUN yarn build

EXPOSE 8001

CMD ["node", "/app/dist/app.js"]