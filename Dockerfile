# Multi-stage Dockerfile for Digital Printing Shop System
# Stage 1: Build the frontend React app
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup the backend Node server and serve frontend
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy backend code
COPY server/ ./server/

# Copy built frontend assets to server public folder (Optional: if serving from Express)
# Alternatively, run them separately. Here we set up a monolithic structure.
WORKDIR /app/server
EXPOSE 5000

CMD ["npm", "start"]
