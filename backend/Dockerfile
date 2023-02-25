FROM node:16-alpine
RUN apk add python3 make g++
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./
RUN npm install --save
RUN npm ci
COPY --chown=node:node . .


EXPOSE 5000
CMD npm run devStart
