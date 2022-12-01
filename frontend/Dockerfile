FROM node:18.4.0

WORKDIR /var/wwwroot

COPY ./ ./
COPY ./sslcert ./sslcert

EXPOSE 3000
EXPOSE 3443

RUN npm ci
RUN npm run build

CMD node ./dist/server.js