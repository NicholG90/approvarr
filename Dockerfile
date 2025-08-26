# ---- Base Node ----
FROM node:alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Test ----
# run linters, setup and tests
FROM dependencies AS test
COPY . .
RUN npm run build

# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /app/node_modules ./node_modules
# copy app sources
COPY . .
# compile TypeScript to JavaScript
RUN npm run build
CMD ["node", "dist/bot.js"]