FROM node:22-bookworm-slim AS base
RUN corepack enable

# ---- deps: dépendances complètes, nécessaires au build ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ---- builder: build Next.js en sortie standalone ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Placeholders de build uniquement : la page est dynamique (elle lit
# searchParams), donc aucun appel à l'API Brawl Stars n'a lieu ici. Les
# vraies valeurs sont injectées au runtime via env_file, jamais figées
# dans cette couche.
ENV BRAWL_STARS_API_KEY="placeholder" \
    BRAWL_STARS_API_BASE="https://api.brawlstars.com/v1"

RUN pnpm build

# ---- runner: image de production minimale ----
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Pas de PM2 ici, contrairement à Promptimo : `restart: unless-stopped`
# dans docker-compose suffit pour un dashboard perso mono-process.
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
