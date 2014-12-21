FROM netflixoss/java:7

MAINTAINER Netflix Open Source Development <talent@netflix.com>

RUN wget -q http://mirrors.ibiblio.org/apache/kafka/0.8.2-beta/kafka_2.10-0.8.2-beta.tgz && \
  tar -zxvf kafka_2.10-0.8.2-beta.tgz && \
  rm kafka_2.10-0.8.2-beta.tgz && \
  cd /kafka_2.10-0.8.2-beta/config/ && \
  sed -i s/zookeeper.connect=localhost/zookeeper.connect=zookeeper/ server.properties
  
ADD fixaddress_and_start_server.sh /kafka_2.10-0.8.2-beta/start_server.sh

RUN chmod +x /kafka_2.10-0.8.2-beta/start_server.sh

EXPOSE 9092

WORKDIR /kafka_2.10-0.8.2-beta

ENTRYPOINT ["/kafka_2.10-0.8.2-beta/start_server.sh"]