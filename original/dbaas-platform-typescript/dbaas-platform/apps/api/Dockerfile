FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/api ./apps/api
RUN pnpm install --no-frozen-lockfile && pnpm --filter @dbaas/contracts build && pnpm --filter @dbaas/api build
FROM node:22-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /app /app
USER app
EXPOSE 4000
CMD ["node","apps/api/dist/server.js"]
