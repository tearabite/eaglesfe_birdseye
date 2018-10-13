var express = require('express');
var app = express();
var WebSocketServer = require('ws').Server;

app.get('*', function (req, res) {
    res.sendfile(__dirname + req.originalUrl);
});

// app.get('client', function (req, res) {
//     res.sendfile(__dirname + '/client/index.html');
// });

// app.get('server', function (req, res) {
//     res.sendfile(__dirname + '/server');
// });

app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
});


socket = new WebSocketServer({
    port: 40510,
});

var data = {};
socket.on('connection', function (ws, req) {
    if (req.url === '/?name=producer'){
        ws.onmessage = function (message) {
            console.log('received: %s', message);
            if (consumer !== null) {
                consumer.send(message.data);
            }
        };
    } else {
        consumer = ws;
    }
});