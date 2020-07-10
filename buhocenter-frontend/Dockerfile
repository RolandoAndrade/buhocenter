FROM node:12

RUN npm install -g serve

WORKDIR /app/client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "serve", "dist", "-s" ]