#!/usr/bin/env bash

gobot download pocketbase --g-os=linux --g-arch=x64 
rclone sync /Users/meta/Library/Caches/gobot-nodejs/pocketbase/archives .pbincache 
find .pbincache | grep .zip | xargs rm
find .pbincache -type f -name 'pocketbase'  | xargs chmod +x
docker build . -t benallfree/pockethost-instance:1.1.0 -t benallfree/pockethost-instance:latest
gobot export pocketbase cjs > versions.cjs