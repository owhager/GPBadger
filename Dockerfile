FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build

EXPOSE 8080
EXPOSE 5657

RUN npm install -g serve


CMD ["npm", "run", "dev"]
