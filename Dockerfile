FROM node:16

# Create app dir
WORKDIR /usr/src/app

# Install App depen
COPY package*.json ./

RUN npm install

# BUndle app source
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm" , "run", "start:prod"]
