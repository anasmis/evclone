# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# The VPS mounts its local CMS configuration for this one build step. The
# secret is readable as .env.local by Vite and the prerenderer, but it is not
# copied into an image layer or into the final nginx image.
RUN --mount=type=secret,id=env_local,target=/app/.env.local \
    npm run build && npm run verify:prerender

FROM nginx:alpine AS production

# Prerendered route folders are emitted below dist/client. Copy that directory
# directly so /news/:slug and /guides/:slug resolve to their generated HTML.
COPY --from=builder /app/dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
