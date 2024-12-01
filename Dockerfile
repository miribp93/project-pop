FROM amazoncorretto:21

ADD target/guaguaupop-0.0.1-SNAPSHOT.jar /opt/sw/guaguaupop.jar

CMD ["java", "-Xms512m", "-Xmx1024m", "-jar", "/opt/sw/guaguaupop.jar"]
