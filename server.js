const ws = require("ws")
const http = require("http")
const server = http.createServer()
const wss0 = new ws.Server({server})

const WSS = new ws.Server({ port: 8081 });

WSS.on('connection', function connection(ws) {
    var flag = 0

    ws.on('message', function incoming(message) {

        console.log('received: %s', message, flag ++);
        ws.send(flag)

    });

    console.log("ws", ws)

    ws.send('Hello client');
    ws.send('I am fine');
    ws.send('Where are you')

});

// TODO: 
// 1. ws 和 http的工程实施上的唯一区别就是: action(get, post...)函数中res可以回复多次。（无action的action也可以看作一个action）
// 2. 实现即时通讯: 即客户端发送的message中含有自己的和请求的id即可利用服务器中转完成。