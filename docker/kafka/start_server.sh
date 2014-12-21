#!/bin/bash
KAFKA_HOSTNAME=`hostname --ip-address`
echo "advertised.host.name=$KAFKA_HOSTNAME" >> /kafka_2.10-0.8.2-beta/config/server.properties
cd /kafka_2.10-0.8.2-beta
sed -i "s/broker.id=0/broker.id=$KAFKA_BROKER_ID/" config/server.properties
bin/kafka-server-start.sh config/server.properties