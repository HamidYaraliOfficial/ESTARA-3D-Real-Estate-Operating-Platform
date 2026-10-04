FROM node:22-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
COPY . .
RUN pnpm install --frozen-lockfile=false && pnpm --filter @estara/api prisma generate && pnpm --filter @estara/api build
EXPOSE 4000
CMD ["pnpm","--filter","@estara/api","start"]
