FROM node:24-alpine

WORKDIR /app

RUN corepack enable \
 && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000
CMD ["pnpm", "run", "dev"]
