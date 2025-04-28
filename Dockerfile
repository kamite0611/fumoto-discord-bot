FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 環境変数の設定
ENV NODE_ENV=production
ENV DISCORD_TOKEN=""
ENV GOOGLE_SERVICE_ACCOUNT_EMAIL=""
ENV GOOGLE_PRIVATE_KEY=""

CMD ["npm", "start"] 