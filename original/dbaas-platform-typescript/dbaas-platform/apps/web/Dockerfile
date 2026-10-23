FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN pnpm install --no-frozen-lockfile && pnpm --filter @dbaas/contracts build && pnpm --filter @dbaas/sdk build && pnpm --filter @dbaas/web build
FROM nginx:1.27-alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
