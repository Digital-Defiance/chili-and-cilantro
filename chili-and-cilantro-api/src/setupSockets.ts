import express from 'express';
import { environment } from './environment';
import { Server } from 'socket.io';
import http from 'http';
import https from 'https';

export function setupSockets(server: http.Server | https.Server): Server {
  const io = new Server(server, {
    cors: {
      origin: environment.developer.corsOrigin,
      methods: ["GET", "POST"],
    }
  });
  io.on('connection', (socket) => {
    console.log('a user connected');
  });
  io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });
  return io;
}