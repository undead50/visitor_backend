# Use an official Node.js runtime as the base image
FROM node:16.17.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install
# RUN npm install bcrypt

# Copy the rest of the application code to the working directory
COPY . .

# Generate the Prisma client code
RUN npx prisma generate


# Install PM2 globally
RUN npm install pm2 -g

# Expose the port on which the Express app will run
EXPOSE 5500

# Start the application using PM2
CMD ["pm2-runtime", "start", "index.js"]
