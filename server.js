const args = require('yargs').argv

if (!args.debug && args.address === undefined) {
    throw new Error("Must specify an address to use as the server. This should be the IP address of the robot controller running BirdseyeServer.")
}

console.log(`Starting Birdseye in ${args.debug ? 'debug' : 'client'} mode...`);

var express = require('express');
var app = express();
var WebSocketServer = require('ws').Server;
var path = require('path');
var opn = require('opn');
var url = require('url');

// Start an HTTP server so we can access the relevant HTML frontend pages.
app.get('*configuration', (req, res, next) => {
    res.json(args);
    res.end();
});

app.get('/', (req, res, next) => {
    res.redirect('/client/')
});

app.get('/node_modules/*', (req, res, next) => {
    res.sendfile(path.join(__dirname, req.url));
});

app.get('/client/*', (req, res, next) => {
    res.sendfile(path.join(__dirname, req.url));
});

args.http = 8080;
app.listen(args.http, function () {
    const clientUrl = `http:localhost:${args.http}`;
    const producerUrl = `http:localhost:${args.http}/debug/`;
    if (args.debug) {
        opn(producerUrl);
    }
    console.log(`Birdseye is now running. You can access it at '${clientUrl}/client/.`);
    opn(clientUrl);
});

// If we're in debug mode, start a websocket server for the two apps to use.
if (args.debug) {
    args.address = 'localhost';
    app.get('/debug/*', (req, res, next) => {
        res.sendfile(path.join(__dirname, req.url.replace('debug', 'producer')));
    });

    socket = new WebSocketServer({ port: args.port });
    socket.broadcast = function broadcast(data, originator) {
        socket.clients.forEach(function each(client) {
            if (client !== socket.producer && client !== originator && client.readyState === 1) {
                client.send(data);
            }
        });
    };

    socket.on('connection', function (ws, req) {
        ws.onmessage = function (message) {
            if (typeof message.data === 'string' && message.data.startsWith('$!')) {
                const controlMessage = message.data.substring(2).toLowerCase();
                if (controlMessage === 'producer') {
                    console.log('DEBUG PRODUCER CONNECTED');
                    socket.producer = ws;
                }
            } else {
                socket.broadcast(message.data, ws);
                console.log(message.data);
            }
        };
        console.log('CLIENT CONNECTED');
    });
}


