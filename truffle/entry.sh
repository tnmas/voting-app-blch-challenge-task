#!/bin/bash

ganache --host 0.0.0.0 &

sleep 5

truffle migrate
wait