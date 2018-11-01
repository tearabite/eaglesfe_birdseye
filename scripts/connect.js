var ws;

function getConfiguration(done) {
    const Http = new XMLHttpRequest();
    Http.open("GET", 'configuration');
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.responseText) {
            const args = JSON.parse(Http.responseText);
            done(args);
        }
    }
}

function connect(address, port) {
    if (ws === undefined || ws.readyState !== 1) {
        const url = `ws://${address}:${port}`;
        console.log(`Attemptng to connect to client at ${address}...`);
        ws = new WebSocket(url);
        ws.onopen = () => {
            var event = new CustomEvent('connected');
            document.dispatchEvent(event);
        };
        ws.onmessage = (ev) => {
            telemetry = JSON.parse(ev.data);
            var event = new CustomEvent('telemetryUpdated', { detail: telemetry });
            document.dispatchEvent(event);
        }
    }
}