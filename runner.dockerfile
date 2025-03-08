FROM gitlab/gitlab-runner:v16.4.0

RUN apt-get update && \
    apt-get install -y curl git && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs

COPY package*.json ./
RUN npm install

RUN npm run build

# Expose port 8080 (or whatever your React app runs on)
EXPOSE 9090
EXPOSE 5657

# Start the app (this assumes you want to run the React app in development mode)
CMD ["npm", "run", "dev"]
