
# Stage 1: Build React using Node.js
FROM node:22-alpine AS build

# docker run -w /app
WORKDIR /app

# Copy dependency definitions first (Docker cache)
COPY package*.json ./

# Install dependencies from package-lock.json
RUN npm ci

# Copy React source code
COPY . .

# Build production files in /app/dist
RUN npm run build


# Stage 2: Serve React using Nginx
FROM nginx:stable-alpine


# Nginx substitutes environment variables at startup
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built React files from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
