# Builder image
FROM node:18-alpine AS builder

WORKDIR /app

# First install dependencies so we can cache them
RUN apk update && apk upgrade
RUN apk add curl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only dependency files first (for better caching)
COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

ENV NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090

# Now copy the rest of the app and build it
COPY . .
RUN pnpm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Create a non-root user
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot

# Copy the standalone output from the builder image
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static

# Prepare the app for production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
