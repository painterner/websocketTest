const ws = require("ws")
const _ = require('lodash')

exports.createServer = (props) => {
    const { port } = props;

    // const http = require("http")
    // const server = http.createServer()
    // const wss0 = new ws.Server({ server })

    const WSS = new ws.Server({ port });

    var gUserIds = [], uIdInc = 0;
    var gUserNames = {};
    var wsTable = {};

    function parse(msg = '') {
        for (var key in CMD) {
            if (msg.startsWith(CMD[key])) {
                var splitSize = 1;
                var cmdParamsFlag = false;
                var contentFlag = false;
                switch (CMD[key]) {
                    case CMD.GetRID: splitSize = 1; cmdParamsFlag = false; contentFlag = false; break;
                    case CMD.Register: splitSize = 2; cmdParamsFlag = true; contentFlag = false; break;
                    case CMD.GetID: splitSize = 2; cmdParamsFlag = true; contentFlag = false; break;
                    case CMD.Send: splitSize = 3; cmdParamsFlag = true; contentFlag = true; break;
                }
                const splitted = msg.split(/\s+/, splitSize)
                const cmd = CMD[key];
                var cmdParams = [];
                var content = null;
                if (splitted.length < splitSize) {
                    if (!contentFlag) return { error: true }
                    if (splitted.length === splitSize - 1) {
                        splitted.push('')
                    } else {
                        return { error: true }
                    }
                }
                if (contentFlag) { content = splitted.slice(-1)[0]; cmdParams = splitted.slice(1, -1); }
                else cmdParams = splitted.slice(1)
                return {
                    cmd,
                    content,
                    cmdParams
                }
            }

        }

        return { cmd: null, cmdParams: [], content: msg }
    }

    const CMD = {
        GetRID: 'getRID',
        Register: 'register',
        GetID: 'getID',
        Send: 'send',
        GetUsers: 'getUsers'
    }

    WSS.on('connection', function connection(ws) {

        ws.on('message', function incoming(message) {
            const parsed = parse(message)
            if (parsed.error) { ws.Send('cmd error'); return; }
            const { cmd, cmdParams, content } = parsed
            console.log('received command: %s, cmdParams:%s, content: %s', cmd, cmdParams, content);
            switch (cmd) {
                case CMD.GetRID: { gUserIds.push(uIdInc); wsTable[uIdInc] = ws; ws.send(uIdInc++); break; }
                case CMD.Register: { const n = cmdParams[0]; gUserNames[n] = uIdInc; gUserIds.push(uIdInc); wsTable[uIdInc] = ws; ws.send(uIdInc++); break; }
                case CMD.GetID: { const n = cmdParams[0]; ws.send(gUserNames[n]); break; }
                case CMD.Send: {
                    var n = cmdParams[0];
                    if (Number.isNaN(Number(n))) n = gUserNames[n];
                    wsTable[n].send(content);
                    break;
                }
                case CMD.GetUsers: { console.log(_.keys(wsTable)); break; }
                default: break;

            }

        });

        console.log("new client connected")

        ws.send('Hello client, all command is:');
        ws.send('getRID                         -- get a random id');
        ws.send('getId username                 -- get a userId by username');
        ws.send('register username              -- register a user by username')
        ws.send('send userId|usrname message    -- send a message to user')

    });

    return WSS;

}