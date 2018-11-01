#!/usr/bin/env node

const args = require('yargs').argv
const express = require('express');
const app = express();
const WebSocketServer = require('ws').Server;
const opn = require('opn');
const jsonfile = require('jsonfile')
const glob = require('glob');
const path = require('path');

var json = jsonfile.readFileSync('config.json');

// Get commandline arguments or their defaults
args.address = json.address || 'localhost';
args.port = json.port || 3708;
args.debug = (args.debug || json.debug) !== undefined;
args.http = json.http || 8080;

if (!args.debug && args.address === undefined) {
    throw new Error("Must specify an address to use as the server. This should be the IP address of the robot controller running BirdseyeServer.")
}

var assets = {};
{
    // Attempt to load or verify basic field model asset information.
    let obj = jsonfile.readFileSync(__dirname + '/client/models/assets.json');
    {
        if (obj === undefined) {
            console.error("No generic field assets defined. Check your assets.json file.");
        } else {
            assets.generic = obj;
        }
    };

    // Attempt to locate and load game specific asset information.
    let files = glob.sync('client/models/games/**/config.json');
    if (files.length === 0) {
        console.warn("No games found in the games directory.")
    } else {
        assets.games = assets.games || [];
        files.forEach(config => {
            json = jsonfile.readFileSync(config);
            const isValid =
                json !== undefined
                && json.name !== undefined
                && json.season != undefined
                && json.assets != undefined
                && json.assets.length > 0;
            if (isValid === true) {
                console.log(`Found game \'${json.name}\'...`);
                json.assets.forEach(asset => {
                    asset.path = path.relative('client', path.join(path.dirname(config), asset.path))
                });
                assets.games.push(json);
            }
        });
    }
}

console.log(`Starting Birdseye in ${args.debug ? 'debug' : 'client'} mode...`);

// Start an HTTP server so we can access the relevant HTML frontend pages.
app.get('*configuration', (req, res, next) => {
    const { _, $0, ...otherKeys } = args;
    res.json(otherKeys);
    res.end();
});

app.get('*assets', (req, res, next) => {
    res.json(assets);
    res.end();
});

app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/client', express.static(path.join(__dirname, 'client')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
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
    app.use('/debug', express.static(path.join(__dirname, 'producer')));

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