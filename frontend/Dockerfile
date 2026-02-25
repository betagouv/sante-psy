FROM node:18-alpine

WORKDIR /app

RUN corepack enable \
 && corepack prepare pnpm@10.26.1 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

COPY frontend/package.json frontend/

# Set CI=true to allow pnpm to remove modules without TTY
ENV CI=true

RUN pnpm install --frozen-lockfile --filter ./frontend

EXPOSE 3000

COPY frontend frontend/

WORKDIR /app/frontend




