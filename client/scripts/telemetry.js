var hud;
var log;
var cmd;

(function buildRightRail() {
    let rightRail = document.createElement('div');
    rightRail.id = 'rightRail';
    document.body.appendChild(rightRail);

    let inner = document.createElement('div');
    inner.id = 'inner';
    rightRail.appendChild(inner);

    let hud = document.createElement('div');
    hud.id = 'hud';
    inner.appendChild(hud);
    hud = CodeMirror(inner.querySelector('#hud'), {lineWrapping: true });

    let log = document.createElement('div');
    log.id = 'log';
    inner.appendChild(log);
    log = CodeMirror(inner.querySelector('#log'), { lineWrapping: true });

    var clog = console.log;
    console.error = console.warn = console.info = console.debug = console.log = (message) => {
        clog(message);
        log.setValue(log.getValue() + '\n' + message);
        log.execCommand('goDocEnd');
    }

    let cmd = document.createElement('input');
    cmd.id = 'cmd';
    cmd.type = 'text';
    rightRail.appendChild(cmd);
    cmd = rightRail.querySelector('#cmd');
    cmd.addEventListener('change', (e) => {
        ws.send(JSON.stringify(cmd.value));
        cmd.value = '';
    });

    document.addEventListener('mouseover', (e) => {
        if (controls !== undefined) {
            controls.enabled = e.path[0].tagName === 'CANVAS';
        }
    });

    document.addEventListener('telemetryUpdated', (e) => {
        hud.setValue(JSON.stringify(telemetry, null, 2));
    });

    document.addEventListener('connected', (e) => {
        log.log(`Connection esablished to ${args.address} on port ${args.port}!`);
    });
})();

