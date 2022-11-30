#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

#cleanup
cd /home/iliya132/inotes/INotes

#Nginx section - required sudo access
echo "updating nginx"
pkill nginx
cp ./nginx.conf /etc/nginx/nginx.conf
nginx

#java section - required sudo access
echo "stopping backend"
pkill java
echo "stopping docker container"
docker stop i_note
docker rm i_note
docker system prune -a -f

#build & run backend
cd inotes
echo "MVN: building"
mvn install -Dmaven.test.skip #cause i got 1 VM and it speeds build a lot (all tests run at GitHub before merging)
echo "starting backend"
nohup java -jar -Dspring.profiles.active=production  ./target/inotes-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &

#build & run frontend
echo "installing node_modules"
cd /home/iliya132/inotes/INotes/frontend
echo "building docker image"
mkdir ~/inotes/INotes/frontend/sslcert
cp /etc/letsencrypt/live/i-note.online/fullchain.pem ~/inotes/INotes/frontend/sslcert/fullchain.pem
cp /etc/letsencrypt/live/i-note.online/privkey.pem ~/inotes/INotes/frontend/sslcert/privkey.pem
docker build -t i-note .
echo "running docker container"
docker run --name i_note -p 3000:3000 -p 3443:3443 -d i-note
rm -rf ~/inotes/INotes/frontend/sslcert
