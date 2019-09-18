const WebSocketServer = require('ws').Server;

var socket;

console.log('Starting debug server.');

socket = new WebSocketServer({ port: 3708 });
socket.broadcast = function broadcast(data, originator) {
    socket.clients.forEach(function each(client) {
        if (client !== originator && client.readyState === 1) {
            client.send(data);
        }
    });
};
socket.on('connection', function (ws, req) {
    console.log('CLIENT CONNECTED');
    ws.on('message', (message) => {
        socket.broadcast(message.data, ws);
        console.log(message.data);
        ws.send("ok " + msgCount++);
    });
    ws.on('close', () => {
        console.log('CLIENT DIS-CONNECTED');
    });
    ws.on('error', (error) => {
        if (error.errno === 'ECONNRESET'){
            console.log('CLIENT REFRESH DETECTED');
        }
        else {
            console.error(error);
        }
    });
});

var i = 0;
function generateTelemtry() {
    const r = 60;

    i = (i + 0.05) % (2 * Math.PI);
    ideg = (i * 180 / Math.PI)
    const x = r * Math.cos(i);
    const y = r * Math.sin(i);
    return {
        timestamp: new Date().getTime(),
        robot: {
            x: Number(x.toFixed(2)),
            y: Number(y.toFixed(2)),
            heading: Number(ideg.toFixed(2))
        }
    }
}

var send = () => {
    socket.broadcast(JSON.stringify(generateTelemtry()));
};

setInterval(send, 1000/10);
