FROM openjdk:11-jre
COPY target/server-*-SNAPSHOT.jar /app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]