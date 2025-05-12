const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const messages = [];
const users = [];
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

server.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

io.on('connection', (socket) => {
  socket.on('message', (message) => {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('join', ({name}) => {
    users.push({user: name, id: socket.id})
    socket.broadcast.emit('message', {
      author: 'Chat Bot',
      content: `${name} has joined the conversation!`
    });
    console.log('users: ',users);
    // console.log('messages: ', messages);
  });
  socket.on('disconnect', () => {
    const index = users.findIndex(user => user.id === socket.id);
    if (index !== -1) {
      socket.broadcast.emit('message', {
        author: 'Chat Bot',
        content: `${users[index].user} has left the conversation... :(`
      });
      users.splice(index, 1);
    }
    console.log('users: ',users);
  });
});