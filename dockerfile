FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

RUN npm run build

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]