# Use Node 18 as the base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your backend code
COPY . .

# Build the React frontend (assuming it's in a subfolder)
RUN cd insa-react && npm install && npm run build

# Expose the ports
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]