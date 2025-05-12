// VARIABLES
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username')
const messageContentInput = document.getElementById('message-content');
let userName = '';
let placeholderTimeout = null;

// INPUT VALIDATION
const showWarning = (input, msg) => {
  if (placeholderTimeout) clearTimeout(placeholderTimeout);
  const originalPlaceholder = userNameInput.placeholder;
  input.placeholder = msg;
  input.classList.add('warning');
  
  const button = input.parentNode.querySelector('button[type="submit"]');
  button.disabled = true;
  
  placeholderTimeout = setTimeout(() => {
    input.placeholder = originalPlaceholder;
    input.classList.remove('warning');
    button.disabled = false;
  }, 2000);
}

// LOGIN FORM
const login = (e) => {
  e.preventDefault();
  if (userNameInput.value !== '') {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    messageContentInput.focus();
    socket.emit('join', {name: userNameInput.value}) // EMITTER
  } else {
    showWarning(userNameInput, 'Who are you');
  }
};

loginForm.addEventListener('submit', login);

//MESSAGE FORM
const addMessage = (user, msg) => {
  messagesList.insertAdjacentHTML('beforeend',`
    <li class="message message--received ${user === userName ? 'message--self' : ''}">
    <h3 class="message__author">${user === userName ? 'You' : user}</h3>
    <div class="message__content ${user === 'Chat Bot' ? 'message--bot' : ''}">${msg}</div>
  </li>`
  );
  messagesList.scrollTop = messagesList.scrollHeight;
};

const sendMessage = (e) => {
  e.preventDefault();
  const msg = messageContentInput.value;
  if (msg !== '') {
    addMessage(userName, msg);
    socket.emit('message', { author: userName, content: msg}) // EMITTER
    messageContentInput.value = '';
  } else {
    showWarning(messageContentInput, 'Type something');
  }
};

addMessageForm.addEventListener('submit', sendMessage);

// WEBSOCKET
const socket = io();

// LISTENER
socket.on('message', ({author, content}) => addMessage(author, content));

