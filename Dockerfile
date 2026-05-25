# Stage 1: Prune the monorepo workspace using Turborepo to isolate dependencies
FROM node:20-alpine AS pruner
RUN npm install -g pnpm turbo
WORKDIR /app
COPY . .
RUN turbo prune @cpm/api-sync-worker --docker

# Stage 2: Build dependencies on pruned workspace
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# First, copy dependency JSONs and pnpm lock file
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Next, copy the pruned full source files
COPY --from=pruner /app/out/full/ .

# Build the targeted api-sync-worker microservice along with local dependencies
RUN pnpm build --filter=@cpm/api-sync-worker...

# Stage 3: Production runner container
FROM node:20-alpine AS runner
WORKDIR /app

# Copy compiled files and node_modules from builder phase
COPY --from=builder /app /app

EXPOSE 3001
ENV NODE_ENV=production

# Boot target service directly
CMD ["node", "apps/api-sync-worker/dist/index.js"]
