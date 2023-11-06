# Specify the base image with Node.js version
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /apps

# Copy the package.json and yarn.lock files to the working directory
COPY package*.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Display the contents of the build context
RUN ls -a

# Build the application
ARG REGISTRY_FOLDER
ARG DATABASE_URL
ARG VITE_OPENAI_API_KEY
ARG VITE_TINY_MCE_KEY
ARG PORT

# Print environment variables during build
RUN echo "REGISTRY_FOLDER: $REGISTRY_FOLDER" && \
    echo "DATABASE_URL: $DATABASE_URL" && \
    echo "VITE_OPENAI_API_KEY: $VITE_OPENAI_API_KEY" && \
    echo "VITE_TINY_MCE_KEY: $VITE_TINY_MCE_KEY" && \
    echo "DB_PORT: $DB_PORT"

# Set environment variables
ENV REGISTRY_FOLDER=$REGISTRY_FOLDER
ENV DATABASE_URL=$DATABASE_URL
ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY
ENV VITE_TINY_MCE_KEY=$VITE_TINY_MCE_KEY
ENV PORT=$PORT

# Expose a port if your application needs to listen on a specific port
EXPOSE $PORT

# Define the command to start your Node.js application
CMD [ "npm", "start" ]
