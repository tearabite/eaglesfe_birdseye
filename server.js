const args = require('yargs').argv
const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server;
const opn = require('opn');

args.address = args.address || 'localhost';
args.port = args.port || 3708;
args.debug = args.debug !== undefined;
args.http = args.http || 8080;
args.open = args.open !== undefined;

console.log(`Starting Birdseye in ${args.debug ? 'debug' : 'client'} mode...`);

if (!args.debug && args.address === undefined) {
    throw new Error("Must specify an address to use as the server. This should be the IP address of the robot controller running BirdseyeServer.")
}

// Start an HTTP server so we can access the relevant HTML frontend pages.
app.get('*configuration', (req, res, next) => {
    const { _, $0, ...otherKeys } = args;
    res.json(otherKeys);
    res.end();
});

app.use('/scripts', express.static('scripts'))
app.use('/client', express.static('client'))
app.use('/node_modules', express.static('node_modules'))
app.listen(args.http, function () {
    const clientUrl = `http:localhost:${args.http}/client/`;
    const producerUrl = `http:localhost:${args.http}/debug/`;

    if (args.open) {
        opn(clientUrl);

        if (args.debug) {
            opn(producerUrl);
        }
    }
    console.log(`Birdseye is now running. You can access it at '${clientUrl}.`);
});

// If we're in debug mode, start a websocket server for the two apps to use.
if (args.debug) {
    app.use('/debug', express.static('producer'))

    socket = new WebSocketServer({ port: args.port });
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
        };
        console.log('CLIENT CONNECTED');
    });
}