var ws;
var args;

(function setupWs() {
    const Http = new XMLHttpRequest();
    new XMLHttpRequest()
    Http.open("GET", 'configuration');
    Http.send();
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.responseText) {
            args = JSON.parse(Http.responseText);
            if (args === undefined) {
                document.body.innerHTML = "ERROR: Is the application running?"
            }
            connect();
        }
    }
    function connect() {
        if (ws === undefined || ws.readyState !== 1) {
            const address = `ws://${args.address}:${args.port}`;
            console.log(`Attemptng to connect to client at ${address}...`);
            ws = new WebSocket(address);
            ws.onopen = (ev) => {
                console.log('Connected!');
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
})();