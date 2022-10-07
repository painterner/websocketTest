const WebSocket = require("ws")

const createClient = (url, props) => {
    const {  } = props

    // Create WebSocket connection.
    const socket = new WebSocket(url);

    // Connection opened
    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', function (event) {
        console.log('Message from server');
        console.log(event.data)
    });
        
    const startRepl = () => {
        const repl = require('repl')
        function handle(cmd, context, filename, callback) {
            // console.log(cmd, context, filename)
            // console.log(callback)
            cmd = cmd.slice(0, -1)  // remove '\n'
            socket.send(cmd)
            callback(null, cmd)  // callback == finish ?
        }
        repl.start({ prompt: '> ', eval: handle })
    };

    return {
        socket,
        startRepl
    };

}


exports.createClient = createClient
