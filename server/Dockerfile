FROM node:10-alpine

ENV NODE_ENV=production

WORKDIR /home/app
COPY ./package*.json ./
RUN npm install

COPY ./ ./

CMD npm run start