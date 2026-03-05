FROM node:24-slim

WORKDIR /chat-server

COPY . /chat-server

RUN npm install
RUN npm run build

EXPOSE 9000
CMD ["npm", "start"]


