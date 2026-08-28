# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0 AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

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


FROM gcr.io/distroless/nodejs20-debian13:nonroot@sha256:c8da1b6cccb5c6cc4b8826c67353f31c5f7b2719c5517b1312d191b337d8bd99 AS runner

ARG APP_VERSION
ARG VCS_REF

LABEL org.opencontainers.image.title="APAE Site Comemorativo" \
      org.opencontainers.image.description="Site comemorativo dos 30 anos da APAE" \
      org.opencontainers.image.source="https://github.com/IFPBEsp/apae-site-comemorativo" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version=$APP_VERSION \
      org.opencontainers.image.revision=$VCS_REF

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=65532:65532 /app/public ./public
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static

USER 65532:65532

EXPOSE 3000

CMD ["server.js"]