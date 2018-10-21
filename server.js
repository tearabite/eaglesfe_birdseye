var express = require('express');
var app = express();
var WebSocketServer = require('ws').Server;
var fs = require('fs');
var path = require('path');
var url = require('url');

app.get('*', function (req, res) {
    const query = url.parse(req.url);
    const isFile = path.parse(query.path).ext !== '';
    if (isFile) {
        res.sendfile(path.join(__dirname, query.path));
    } else {
        res.sendfile(path.join(__dirname, query.path, 'index.html'));
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
            if (consumer) {
                consumer.send(message.data);
            }
        };
    } else {
        console.log('CLIENT CONNECTED');
        consumer = ws;
    }
});