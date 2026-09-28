FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/client/public ./client/public
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/src/db/schema.sql ./server/src/db/schema.sql
EXPOSE 3000
CMD ["node", "server/dist/app.js"]
