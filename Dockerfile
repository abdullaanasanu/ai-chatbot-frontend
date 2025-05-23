# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -f

COPY . .
RUN npm run build

# Run the built app
CMD ["npm", "run", "preview"]

# Expose the port the app runs on
EXPOSE 4173