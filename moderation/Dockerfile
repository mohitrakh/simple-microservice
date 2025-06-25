# 1. Use official Node base image
FROM node:alpine

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy only package.json first to leverage Docker cache
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your app code
COPY . .

# 6. Start the app
CMD ["npm", "start"]
