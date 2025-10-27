// pottan.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public','ben.html')));

const users = {};      // socket.id -> name
const userRoom = {};   // socket.id -> room
const rooms = {};      // code -> Set(socket.id)

function broadcastMembers(room){
  const s = io.sockets.adapter.rooms.get(room);
  const names = [];
  if(s){
    for(const sid of s) if(users[sid]) names.push(users[sid]);
  }
  io.to(room).emit('updateMembers', names);
}

io.on('connection', socket=>{
  console.log('conn', socket.id);

  socket.on('joinGlobal', (name)=>{
    users[socket.id] = name;
    userRoom[socket.id] = 'global';
    socket.join('global');
    console.log(`${name} joined global`);
    io.to('global').emit('message', { type:'system', msg: `${name} joined the chat!` });
    broadcastMembers('global');
  });

  socket.on('chatMessage', ({ room, name, msg })=>{
    const roomTo = room || userRoom[socket.id] || 'global';
    io.to(roomTo).emit('message', { type:'chat', name, msg });
  });

  socket.on('createRoom', (name)=>{
    const code = (Math.floor(1000 + Math.random() * 9000)).toString();
    rooms[code] = new Set();
    const prev = userRoom[socket.id];
    if(prev) socket.leave(prev);
    socket.join(code);
    rooms[code].add(socket.id);
    userRoom[socket.id] = code;
    console.log(`${name} created room ${code}`);
    socket.emit('roomCreated', code);
    socket.emit('clearChat');
    broadcastMembers(code);
  });

  socket.on('joinRoom', ({ name, code })=>{
    if(!rooms[code]) { socket.emit('message', { type:'system', msg:`Invalid room code: ${code}` }); return; }
    const prev = userRoom[socket.id];
    if(prev) socket.leave(prev);
    socket.join(code);
    rooms[code].add(socket.id);
    userRoom[socket.id] = code;
    io.to(code).emit('message', { type:'system', msg: `${name} joined the room!` });
    socket.emit('roomJoined', code);
    socket.emit('clearChat');
    broadcastMembers(code);
  });

  socket.on('leaveRoom', ({ name, room })=>{
    const prev = userRoom[socket.id];
    if(prev && prev !== 'global'){
      socket.leave(prev);
      if(rooms[prev]) rooms[prev].delete(socket.id);
      io.to(prev).emit('message', { type:'system', msg: `${name} left the room.` });
      broadcastMembers(prev);
    }
    socket.join('global');
    userRoom[socket.id] = 'global';
    io.to('global').emit('message', { type:'system', msg: `${name} returned to global chat.` });
    broadcastMembers('global');
    socket.emit('clearChat');
  });

  socket.on('typing', ({ name, room })=>{
    const r = room || userRoom[socket.id] || 'global';
    socket.to(r).emit('displayTyping', name);
  });
  socket.on('stopTyping', ({ name, room })=>{
    const r = room || userRoom[socket.id] || 'global';
    socket.to(r).emit('hideTyping');
  });

  socket.on('requestActive', (room) => broadcastMembers(room || userRoom[socket.id] || 'global'));
  socket.on('clearChat', () => socket.emit('clearChat'));

  socket.on('disconnect', ()=>{
    const name = users[socket.id];
    const room = userRoom[socket.id] || 'global';
    if(name){
      console.log('disconnect', name);
      io.to(room).emit('message', { type:'system', msg: `${name} left the chat.` });
      delete users[socket.id];
      delete userRoom[socket.id];
      if(rooms[room]) rooms[room].delete(socket.id);
      broadcastMembers(room);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, ()=> console.log('Server running on http://localhost:' + PORT));
