FROM openjdk:11-jre
COPY target/server-0.0.1-SNAPSHOT.jar /app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]