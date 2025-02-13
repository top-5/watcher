# Use official Node.js image
FROM node:20-alpine

# Install git
RUN apk add --no-cache git

# Set working directory
WORKDIR /

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy script
COPY watcher.js ./
COPY config.json ./

# Expose the volume
VOLUME ["/storage"]

# Docker WSL requires polling for file changes
ENV USE_POLLING=1

# Start the watcher script
CMD ["node", "watcher.js"]
