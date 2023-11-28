# Use the official Node.js 16.11.1 image as the base image
FROM node:16.11.1

# Set the working directory to /app
WORKDIR /app

# Copy the package.json file to the container
COPY package.json ./

# Install the project dependencies
RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Start the server
ENTRYPOINT [ "npm", "run", "start" ]
