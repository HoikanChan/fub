#!/bin/bash

NUM=''

if [ ! -n "$1" ] ;then
        NUM=200
else
        NUM=$1
fi

tail -n $NUM /tmp/logs/rsclouds-luohu-web.log | less -m
