FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl python3 make g++
RUN npm install -g pnpm@10.33.4

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN pnpm install --frozen-lockfile --shamefully-hoist

COPY . .

ARG NEXT_PUBLIC_URL_APAE
ARG NEXT_PUBLIC_BASE_PATH
ENV NEXT_PUBLIC_URL_APAE=$NEXT_PUBLIC_URL_APAE
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache openssl
RUN npm install -g pnpm@10.33.4

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs
EXPOSE 3000

CMD ["pnpm", "start"]