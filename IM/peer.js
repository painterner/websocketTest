const WebSocket = require("ws")

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8081');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

const repl = require('repl')
function handle(cmd, context, filename, callback) {
    // console.log(cmd, context, filename)
    // console.log(callback)
    cmd = cmd.slice(0,-1)  // remove '\n'
    socket.send(cmd)
    callback(null, cmd)  // callback == finish ?
}
repl.start({prompt: '> ', eval: handle})
