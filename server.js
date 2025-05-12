const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const { measureMemory } = require('vm');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const messages = [];
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

server.listen(8000, () => {
  console.log('Server is running on port: 8000');
});


io.on('connection', (socket) => {
  console.log('New client! Its id - ' + socket.id);
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id)
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left')
  });
  console.log('I\'ve added a listener on message and disconnect evet \n');
});