# 1. Use an official Node.js runtime as a base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /usr/src/app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN yarn install

# 5. Copy the rest of the application
COPY . .

# 6. Build the NestJS app
RUN yarn build

# 7. Expose the application port
EXPOSE 8000

# 8. Run the app
CMD ["yarn", "run", "start:prod"]
