FROM node:18-alpine

WORKDIR /app 

RUN corepack enable \
 && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 8080
CMD ["pnpm", "run", "dev"]
