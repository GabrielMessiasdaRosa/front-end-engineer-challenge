FROM node:latest

WORKDIR /app

COPY . .

RUN npm install -g wait-port
RUN npm install

CMD ["sh", "-c", "wait-port postgres:5432 && npm run build && npm run start"]
