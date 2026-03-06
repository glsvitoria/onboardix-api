FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate

COPY . .

RUN pnpm run build

FROM node:22-alpine AS runner

RUN apk add --no-cache openssl
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --prod --frozen-lockfile

RUN pnpm prisma generate

COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]