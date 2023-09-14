FROM node:16
WORKDIR /app

COPY package*.json ./

#Install all dependencies
RUN npm install

# Copy everything from the source folder into the src dir of the Docker container
COPY . .

# Exposes the internal port inside container to the rest of the local machine
EXPOSE 8000

CMD ["npm", "run", "dev"]
