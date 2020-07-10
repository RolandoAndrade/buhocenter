FROM node:12

# Create app directory
WORKDIR /app/api

# Copy package files
COPY package*.json ./

# Install npm packages
RUN npm install

# Bundle app source
COPY . .

# Build our app for production
RUN npm run build:prod

CMD [ "npm", "run", "start:prod" ]

