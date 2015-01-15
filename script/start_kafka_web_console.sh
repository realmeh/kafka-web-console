#!/bin/bash
cd ..
nohup build/kafka-web-console-2.1.0-SNAPSHOT/bin/kafka-web-console -DapplyEvolutions.default=true -Dhttp.port=8992 &
