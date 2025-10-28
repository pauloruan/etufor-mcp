FROM node:22-slim AS build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3333

RUN npm run build
