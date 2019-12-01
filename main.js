const WebSocket = require("ws")

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8081');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
    socket.send('How are you !');
    socket.send(`It's secret`)
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});