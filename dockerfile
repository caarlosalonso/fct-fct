FROM eclipse-temurin:21-jdk AS build

WORKDIR /app
COPY . /app

RUN chmod +x ./mvnw && ./mvnw -DoutputFile=target/mvn-dependency-list.log -B -DskipTests clean dependency:list install
