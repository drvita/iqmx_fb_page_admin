# Stage 1: Install dependencies and build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Environment variables needed at build-time (baked into Next.js static files)
ARG NEXT_PUBLIC_FB_APP_ID
ARG NEXT_PUBLIC_FB_API_VERSION
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_FB_APP_ID=$NEXT_PUBLIC_FB_APP_ID
ENV NEXT_PUBLIC_FB_API_VERSION=$NEXT_PUBLIC_FB_API_VERSION
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

CMD ["npm", "run", "start"]
