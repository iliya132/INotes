#!/bin/bash
#cleanup
pkill java
docker stop i_note

cd /home/iliya132/inotes/INotes
git checkout main
git pull
cd inotes
mvn install
nohup java -jar -Dspring.profiles.active=production  ./target/inotes-0.0.1-SNAPSHOT.jar > /dev/null 2>%1 &
cd ../frontend
npm ci
docker build -t i-note .
docker run --name i_note -p 3000:3000 -d i-note