FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json .
RUN npm install --production

# Bundle app source
COPY . .

EXPOSE 3030
CMD [ "npm", "run", "dev" ]
