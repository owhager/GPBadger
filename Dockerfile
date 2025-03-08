FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
RUN npm run build

EXPOSE 80
EXPOSE 5657

RUN npm install -g serve


CMD ["serve", "-s", "build", "-l", "80", "5657"]