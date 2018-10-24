var hud;
var log;
var cmd;

(function buildRightRail() {
    let addRow = function (kind, id) {
        let tr = document.createElement('tr');
        let elmnt = document.createElement(kind);
        elmnt.id = id;
        tr.appendChild(elmnt);
        rightRailTable.appendChild(tr);
    };

    let rightRailDiv = document.createElement('div');
    let rightRailTable = document.createElement('table');
    rightRailDiv.id = 'rightRail';
    rightRailTable.id = 'rightRailTable';
    rightRailDiv.appendChild(rightRailTable);

    addRow('div', 'hud');
    hud = CodeMirror(rightRailTable.querySelector('#hud'), {lineWrapping: true });

    addRow('div', 'log');
    log = CodeMirror(rightRailTable.querySelector('#log'), { lineWrapping: true });
    log.log = (message) => {
        log.setValue(log.getValue() + '\n' + message);
        log.execCommand('goDocEnd');
    };

    addRow('input', 'cmd');
    cmd = rightRailTable.querySelector('#cmd');
    cmd.type = 'text';
    cmd.id = 'cmd';

    cmd.addEventListener('change', (e) => {
        ws.send(JSON.stringify(cmd.value));
        cmd.value = '';
    });

    document.body.appendChild(rightRailDiv);

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
