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

function setConfiguration(args) {
    const Http = new XMLHttpRequest();
    Http.open("POST", 'configuration');
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Http.send(JSON.stringify(args));
}

function connect(address, port, onopen, onmessage, onclose, onerror) {
    const url = `ws://${address}:${port}`;
    const ws = new WebSocket(url);
    ws.onopen = () => { onopen && onopen() };
    ws.onmessage = (ev) => { onmessage && onmessage(JSON.parse(ev.data)); };
    ws.onclose = () => { onclose && onclose(); };
    ws.onerror = () => { onerror && onerror(); };
    return ws;
}