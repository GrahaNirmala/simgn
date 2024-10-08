FROM node:18.17.1-alpine3.18 AS builder
RUN mkdir -p /app
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18.17.1-alpine3.18
RUN mkdir -p /app
WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/drizzle ./drizzle

RUN apk update --no-cache && \
    apk add --no-cache \
    ca-certificates \
    bash \
    tzdata \
    curl \
    postgresql15-client

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENTRYPOINT ["/app/node_modules/.bin/next", "start"]
