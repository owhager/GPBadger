FROM gitlab/gitlab-runner:v16.4.0

RUN apt-get update && \
    apt-get install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

COPY package*.json ./
RUN npm install

RUN npm run build

# Expose port 9090 for frontend and 5657 for backend
EXPOSE 9090
EXPOSE 5657

CMD ["npm", "run", "dev"]
