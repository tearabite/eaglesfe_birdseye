var hud, log, cmd;

hud = CodeMirror(inner.querySelector('#hud'), {
    lineWrapping: true
});
log = CodeMirror(inner.querySelector('#log'), {
    lineWrapping: true
});

var clog = console.log;
console.error = console.warn = console.info = console.debug = console.log = (message) => {
    clog(message);
    log.setValue(log.getValue() + '\n' + message);
    log.execCommand('goDocEnd');
}

cmd = rightRail.querySelector('#cmd');
cmd.addEventListener('change', (e) => {
    ws.send(JSON.stringify(cmd.value));
    cmd.value = '';
});

popIn = () => {
    rightRail.animate([{
            opacity: 0,
            transform: 'scale(0.7)',
        },
        {
            transform: 'scale(1.2)',
            opacity: 1,
            easing: 'ease-out'
        },
        {
            transform: 'scale(1.0)',
            opacity: 1,
            easing: 'ease-in'
        }
    ], 350);
};

popOut = () => {
    rightRail.animate([{
            opacity: 1,
            transform: 'scale(1.0)',
        },
        {
            transform: 'scale(1.2)',
            opacity: 1,
            easing: 'ease-out'
        },
        {
            transform: 'scale(0.7)',
            opacity: 0,
            easing: 'ease-in'
        }
    ], 350);
};

document.addEventListener('mouseover', (e) => {
    if (controls !== undefined) {
        controls.enabled = e.path[0].tagName === 'CANVAS';
    }
});

document.addEventListener('telemetryUpdated', (e) => {
    hud.setValue(JSON.stringify(telemetry, null, 2));
});

document.addEventListener('connected', (e) => {
    console.log(`Connection esablished to ${args.address} on port ${args.port}!`);
});

popIn();