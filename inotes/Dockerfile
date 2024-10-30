FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /src

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline
COPY src src
RUN ls
RUN ./mvnw package -DskipTests

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/inotes-0.0.1-SNAPSHOT.jar"]