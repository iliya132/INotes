FROM node:18.4.0

WORKDIR /var/wwwroot

COPY ./ ./

EXPOSE 3000

RUN npm ci
RUN npm run build

CMD node ./dist/server.js