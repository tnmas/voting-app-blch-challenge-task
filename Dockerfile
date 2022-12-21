FROM node:alpine

WORKDIR /app/

COPY src /app/src 
COPY public /app/public
COPY .env /app/.env
COPY package.json /app/package.json

RUN npm install --quiet

EXPOSE 80

CMD [ "npm", "run-script", "start"]
