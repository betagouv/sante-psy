FROM node:14-alpine

WORKDIR /app 

COPY .env.sample .env
COPY . /app 

EXPOSE 8080

RUN npm install
