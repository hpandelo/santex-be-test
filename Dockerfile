# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine AS setup

WORKDIR /usr/src/app

ENV NODE_ENV production

RUN --mount=type=cache,target=/usr/src/app/ \
    --mount=type=bind,source=package.json,target=package.json\
    --mount=type=bind,source=package-lock.json,target=package-lock.json\
    npm ci

# ----------------------------------------------------------------

FROM node:${NODE_VERSION}-alpine AS development

WORKDIR /usr/src/app

RUN --mount=type=cache,target=/usr/src/app/ \
    --mount=type=bind,source=package.json,target=package.json\
    --mount=type=bind,source=package-lock.json,target=package-lock.json\
    npm ci

# COPY . .
# RUN npm install
# RUN npm run prepare

# ----------------------------------------------------------------
FROM setup as builder
RUN --mount=type=cache,target=/usr/src/app/ \
    --mount=type=bind,target=. \
    npm run build

# ----------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner

RUN addgroup -S nodejs \
    && adduser -S -u 10000 -g nodejs nodejs

USER nodejs

COPY --chown=nodejs:nodejs --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=builder /usr/src/app/dist ./dist
COPY --chown=nodejs:nodejs .env .

EXPOSE 3000

CMD [ "node", "dist/index.js" ]