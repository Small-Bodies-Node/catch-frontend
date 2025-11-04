FROM node:24-alpine AS builder
ENV NODE_OPTIONS=--max-old-space-size=8192
WORKDIR /app

# Install dependencies needed to build the SSR bundle
COPY package*.json ./
RUN npm ci

# Copy the rest of the project and build the Angular Universal app
COPY . .
RUN npm run build:docker


FROM node:24-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled Angular SSR output
COPY --from=builder /app/dist ./dist

USER node
EXPOSE 4000

CMD ["node", "dist/catch-frontend-ng20/server/server.mjs"]
