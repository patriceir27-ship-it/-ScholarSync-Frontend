# ============================================================================
# CHANCEN FRONTEND DOCKERFILE
# Multi-stage build for optimized Next.js production image
# ============================================================================

# Stage 1: Dependencies
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --frozen-lockfile

# ============================================================================
# Stage 2: Builder
# ============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules

COPY src ./src
COPY public ./public
COPY next.config.js tsconfig.json tailwind.config.ts postcss.config.js ./

# Build Next.js application
RUN npm run build

# ============================================================================
# Stage 3: Runtime
# ============================================================================
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init curl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy only necessary files from deps
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# Set ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/api/health || exit 1

# Expose port
EXPOSE ${PORT:-3000}

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js application
CMD ["node", "server.js"]
