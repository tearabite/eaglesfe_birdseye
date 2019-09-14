const WebSocketServer = require('ws').Server;

var socket;

console.log('Starting debug server.');

socket = new WebSocketServer({ port: 8080 });
socket.broadcast = function broadcast(data, originator) {
    socket.clients.forEach(function each(client) {
        if (client !== originator && client.readyState === 1) {
            client.send(data);
        }
    });
};
socket.on('connection', function (ws, req) {
    ws.onmessage = function (message) {
        socket.broadcast(message.data, ws);
        console.log(message.data);
        ws.send("ok " + msgCount++);
    };
    console.log('CLIENT CONNECTED');
});

var i = 0;
function generateTelemtry() {
    const r = 60;

    i = (i + 0.01) % (2 * Math.PI);
    ideg = (i * 180 / Math.PI)
    const x = r * Math.cos(i);
    const y = r * Math.sin(i);
    return {
        timestamp: new Date().getTime(),
        robot: {
            x: x,
            y: y,
            heading: ideg
        }
    }
}

var send = () => {
    socket.broadcast(JSON.stringify(generateTelemtry()));
};

setInterval(send, 1000/60);
