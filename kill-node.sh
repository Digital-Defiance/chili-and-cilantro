#!/bin/bash

# Find the process using port 3000
NODE_PROCESS=$(lsof -t -i:3000)

# Check if a process was found
if [ -n "$NODE_PROCESS" ]; then
  echo "Killing process $NODE_PROCESS using port 3000"
  kill -9 $NODE_PROCESS
else
  echo "No process found using port 3000"
fi