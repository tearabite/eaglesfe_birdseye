#!/usr/bin/env node

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const WebSocketServer = require('ws').Server;
const opn = require('opn');
const jsonfile = require('jsonfile')
const path = require('path');
const utility = require('./utility');

var configuration = {
    debug: true,
    address: 'localhost',
    port: 8081,
    http: 8080,
    open: true
};

if (fs.existsSync(path.join(__dirname, './config.json'))) {
    const config = jsonfile.readFileSync('config.json');
    configuration.debug     = config.debug === true;
    configuration.address   = config.address || configuration.address;
    configuration.port      = config.port || configuration.port;
    configuration.http      = config.http || configuration.http;
    configuration.open = config.open === true;

} else {
    jsonfile.writeFileSync('config.json', configuration);
}

var assets = utility.loadAssets();

console.log(`Starting Birdseye in ${configuration.debug ? 'DEBUG' : 'CLIENT'} mode...`);

// Start an HTTP server so we can access the relevant HTML frontend pages.
app.use(bodyParser.json())
app.post('*configuration', (req, res, next) => {
    let portChanged = configuration.port != req.body.port;
    Object.assign(configuration, req.body);
    if (portChanged) {
        if (configuration.debug === false) {
            stopServer();
        } else {
            restartServer();
        }
    }

    jsonfile.writeFile(path.join(__dirname, 'config.json'), req.body);
    res.end();
});

app.get('*configuration', (req, res, next) => {
    res.json(configuration);
    res.end();
});

app.get('*assets', (req, res, next) => {
    res.json(assets);
    res.end();
});

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.listen(configuration.http, function () {
    const clientUrl = `http:localhost:${configuration.http}/client/`;
    const producerUrl = `http:localhost:${configuration.http}/debug/`;

    if (configuration.open === true) {
        opn(clientUrl);

        if (configuration.debug) {
            opn(producerUrl);
        }
    }
    console.log(`Birdseye is now running. You can access it at '${clientUrl}.`);
});


// --- DEBUG SERVER ---
var socket;

var stopServer = function () {
    if (socket !== undefined) {
        console.log('Stopping debug server.');
        app.use('/debug', (req, res, next) => { res.end(); });

        socket.close()
    }
}

var startServer = function () {
    console.log('Starting debug server.');
    app.use('/debug', express.static(path.join(__dirname, 'producer')));

    socket = new WebSocketServer({ port: configuration.port });
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

var restartServer = function () {
    stopServer();
    startServer();
}

if (configuration.debug) {
    restartServer();
}