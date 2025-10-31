FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src ./src
COPY tsconfig.json ./

RUN npm install typescript && \
    npm run build && \
    npm uninstall typescript

RUN rm -rf src tsconfig.json

CMD ["npm", "start"]

