FROM node:18-alpine

WORKDIR /app 

COPY .env.sample .env

RUN corepack enable \
 && corepack prepare pnpm@10.26.1 --activate

COPY . /app 

EXPOSE 8080

# Set CI=true to allow pnpm to remove modules without TTY
ENV CI=true 

RUN pnpm install --frozen-lockfile
