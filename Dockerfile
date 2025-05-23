# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -f

COPY . .
RUN npm run build
EXPOSE 3000

# Run the built app
CMD ["npm", "run", "preview"]
