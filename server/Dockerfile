FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Run lint to catch errors early
RUN npm run lint
EXPOSE 5000
CMD ["node", "server.js"]
