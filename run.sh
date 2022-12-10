#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

#cleanup
cd /home/iliya132/inotes/INotes

#fetch
echo "GIT: checkout main branch"
git checkout main
echo "GIT: pulling changes"
git pull

#Nginx section - required sudo access
echo "updating nginx"
pkill nginx
cp ./nginx.conf /etc/nginx/nginx.conf
nginx

#build backend
cd inotes
echo "Build backend"
mvn install -Dmaven.test.skip #cause i got 1 VM and it speeds build a lot (all tests run at GitHub before merging)
echo "Done"
#build frontend
cd /home/iliya132/inotes/INotes/frontend
echo "Build frontend"
mkdir /home/iliya132/inotes/INotes/frontend/sslcert
cp /etc/letsencrypt/live/i-note.online/fullchain.pem /home/iliya132/inotes/INotes/frontend/sslcert/fullchain.pem
cp /etc/letsencrypt/live/i-note.online/privkey.pem /home/iliya132/inotes/INotes/frontend/sslcert/privkey.pem
docker stop i_note
docker rm i_note
docker build -t i-note .
echo "Done"
echo "Stop old backend"
pkill java
echo "Done"
echo "Start new backend"
nohup java -jar -Dspring.profiles.active=production  ./target/inotes-0.0.1-SNAPSHOT.jar > /dev/null 2>&1 &
echo "Done"
echo "Start frontend"
echo "stopping docker container"

docker run --name i_note -p 3000:3000 -p 3443:3443 -d i-note
docker image prune -a -f

rm -rf /home/iliya132/inotes/INotes/frontend/sslcert
