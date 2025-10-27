// public/reby.js
console.log('reby.js loaded');

const socket = io();

// elements
const nameInput = document.getElementById('nameInput');
const joinBtn = document.getElementById('joinBtn');
const app = document.getElementById('app');
const heading = document.getElementById('heading');

const messagesDiv = document.querySelector('.messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.querySelector('.typingIndicator');
const membersList = document.getElementById('membersList');

const menuDots = document.getElementById('menuDots');
const menuPopup = document.getElementById('menuPopup');
const createRoomBtn = document.getElementById('createRoom');
const joinRoomBtn = document.getElementById('joinRoom');
const leaveRoomBtn = document.getElementById('leaveRoom');

let username = '';
let currentRoom = 'global';
let typingTimer = null;

function showApp() {
  document.querySelector('.overlay')?.classList.add('hidden');
  app.classList.remove('hidden');
}

function showOverlay() {
  document.querySelector('.overlay')?.classList.remove('hidden');
  app.classList.add('hidden');
}

function appendMessage(type, payload) {
  const el = document.createElement('div');
  if (type === 'system') {
    el.className = 'system wobble';
    el.textContent = payload;
  } else {
    const me = payload.name === username;
    el.className = me ? 'message msg-right' : 'message msg-left';
    el.innerHTML = `<div class="meta">${payload.name}</div><div class="body">${payload.text}</div>`;
  }
  messagesDiv.appendChild(el);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

joinBtn.addEventListener('click', () => {
  const v = nameInput.value.trim();
  if (!v) return alert('Enter your name');
  username = v;
  localStorage.setItem('chat_name', username);
  showApp();
  console.log('[client] joinGlobal ->', username);
  socket.emit('joinGlobal', username);
});
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') joinBtn.click();
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('chatMessage', { room: currentRoom, name: username, msg: text });
  messageInput.value = '';
  socket.emit('stopTyping', { name: username, room: currentRoom });
}
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

messageInput.addEventListener('input', () => {
  if (!username) return;
  socket.emit('typing', { name: username, room: currentRoom });
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() =>
    socket.emit('stopTyping', { name: username, room: currentRoom }),
  1200);
});

menuDots?.addEventListener('click', (e) => {
  e.stopPropagation();
  menuPopup?.classList.toggle('hidden');
});
window.addEventListener('click', (e) => {
  if (!menuPopup?.contains(e.target) && !menuDots?.contains(e.target))
    menuPopup?.classList.add('hidden');
});

createRoomBtn?.addEventListener('click', () => {
  if (!username) return alert('Join first');
  socket.emit('createRoom', username);
});
joinRoomBtn?.addEventListener('click', () => {
  if (!username) return alert('Join first');
  const pin = prompt('Enter 4-digit PIN to join:');
  if (pin) socket.emit('joinRoom', { name: username, code: pin.trim() });
});

leaveRoomBtn?.addEventListener('click', () => {
  if (!username) return;
  socket.emit('leaveRoom', { name: username, room: currentRoom });
  currentRoom = 'global';
  heading.textContent = 'AVARATHAM PARAYUKA POVUKA ✨';
  document.body.style.backgroundImage = "url('https://files.catbox.moe/3jvej7.jpg')";
  leaveRoomBtn.classList.add('hidden');
  socket.emit('requestActive', 'global');
  socket.emit('clearChat');
});

// Socket events
socket.on('connect', () => {
  console.log('[client] connected', socket.id);
  // ALWAYS show name prompt first, don’t auto-join
  showOverlay();
});

socket.on('message', (data) => {
  if (!data) return;
  if (data.type === 'system') appendMessage('system', data.msg);
  else if (data.type === 'chat')
    appendMessage('chat', { name: data.name, text: data.msg });
});

socket.on('updateMembers', (members) => {
  membersList.innerHTML = '';
  members.forEach((m) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="dot"></span> ${m}`;
    membersList.appendChild(li);
  });
});

socket.on('displayTyping', (name) => {
  typingIndicator.textContent = `${name} is typing...`;
  typingIndicator.classList.add('show');
});
socket.on('hideTyping', () => {
  typingIndicator.classList.remove('show');
  typingIndicator.textContent = '';
});

socket.on('roomCreated', (code) => {
  alert('Your Room Code: ' + code + ' ✨');
  currentRoom = code;
  document.body.style.backgroundImage = "url('https://files.catbox.moe/5zmuac.jpg')";
  heading.textContent = 'MOOD ALLEEE';
  leaveRoomBtn.classList.remove('hidden');
  socket.emit('requestActive', code);
  socket.emit('clearChat');
});
socket.on('roomJoined', (code) => {
  currentRoom = code;
  document.body.style.backgroundImage = "url('https://files.catbox.moe/5zmuac.jpg')";
  heading.textContent = 'MOOD ALLEEE';
  leaveRoomBtn.classList.remove('hidden');
  socket.emit('requestActive', code);
  socket.emit('clearChat');
});

socket.on('clearChat', () => {
  messagesDiv.innerHTML = '';
});

socket.on('debug', (m) => console.log('[debug]', m));
socket.on('connect_error', (err) => console.error('connect_error', err));
