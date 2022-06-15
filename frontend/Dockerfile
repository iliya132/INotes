FROM node:16

WORKDIR /var/wwwroot

COPY ./ ./

EXPOSE 3000

RUN npm install
RUN npm run build

CMD node ./dist/server.js