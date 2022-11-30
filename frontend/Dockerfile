FROM node:18.4.0

WORKDIR /var/wwwroot

COPY ./ ./
COPY /etc/letsencrypt/live/i-note.online/fullchain.pem ./cert/fullchain.pem
COPY /etc/letsencrypt/live/i-note.online/privkey.pem ./cert/privkey.pem

EXPOSE 3000

RUN npm ci
RUN npm run build

CMD node ./dist/server.js