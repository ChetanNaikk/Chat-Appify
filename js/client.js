const socket = io('http://localhost:8000',{transports: ['websocket']});

const form =document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
var audio = new Audio('ting.mp3');
var audio2 = new Audio('entry.mp3');
var audio3 = new Audio('exit.mp3');

const append = (message, position )=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
    if(position == 'centre'){
        audio2.play();
    }
    if(position == 'leave'){
        audio3.play();
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send',message);
    messageInput.value = '';
})

//New user name
const name = prompt("Enter your name to Join");
socket.emit('new-user-joined', name);

//Let the server know about new user
socket.on('user-joined', name =>{
append(`${name} joined the chat`, 'centre')
})

//message broadcast
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left')
})

//broadcast the left user name to others
socket.on('left', name =>{
    append(`${name} left the chat`, 'leave')
})