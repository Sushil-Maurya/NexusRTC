const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

// Simple state to keep track of users in a room. 
// For this demo, we can just use a single global room "nexus-room"
const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    
    // Notify others in the room
    socket.to(roomId).emit('user-connected', socket.id);
    console.log(`User ${socket.id} joined room ${roomId}`);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.to(roomId).emit('user-disconnected', socket.id);
    });

    // WebRTC Signaling Events
    socket.on('offer', (data) => {
      socket.to(roomId).emit('offer', {
        callerId: socket.id,
        sdp: data.sdp,
      });
    });

    socket.on('answer', (data) => {
      socket.to(roomId).emit('answer', {
        answererId: socket.id,
        sdp: data.sdp,
      });
    });

    socket.on('ice-candidate', (data) => {
      socket.to(roomId).emit('ice-candidate', {
        senderId: socket.id,
        candidate: data.candidate,
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
