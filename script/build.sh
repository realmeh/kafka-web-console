#!/bin/bash
cd ..
sbt dist

mkdir build
cd build
unzip ../target/universal/kafka-web-console-2.1.0-SNAPSHOT.zip
