var express = require('express');
var app = express();
var WebSocketServer = require('ws').Server;
var fs = require('fs');
var path = require('path');

const CLIENT_PATH = path.join(__dirname, 'client', 'index.html');
const SERVER_PATH = path.join(__dirname, 'server', 'index.html');

app.get('*', function (req, res) {
    if (req.url === '/server'){
        res.sendfile(SERVER_PATH);
    } else if (req.url === '/client') {
        res.sendfile(CLIENT_PATH);
    } else {
        res.sendfile(path.join(__dirname, req.originalUrl));
    }
});

app.listen(8081, function () {
    console.log('Example app listening on port 8081!');
});


socket = new WebSocketServer({
    port: 40510,
});

var data = {};
socket.on('connection', function (ws, req) {
    if (req.url === '/?name=producer'){
        console.log('SERVER CONNECTED');
        ws.onmessage = function (message) {
            console.log('received: %s', message);
            consumer.send(message.data);
        };
    } else {
        console.log('CLIENT CONNECTED');
        consumer = ws;
    }
});