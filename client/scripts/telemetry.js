var hud, log, cmd;

var codemirrorOptions = {
    lineWrapping: true,
    readOnly: true,
    cursorBlinkRate: -1
};

hud = CodeMirror(document.querySelector('#hud'), codemirrorOptions);
log = CodeMirror(document.querySelector('#log'), codemirrorOptions);

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

pop = (element, popIn) => {
    element.animate([
        {
            opacity: 0,
            transform: 'scale(0)',
        },
        {
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
    ], {duration: 350, fill: 'both', direction: popIn ? 'normal' : 'reverse'});
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

pop(rightRail, true);

settingsMenu = () => {
    var settingsMenu = document.getElementById('settingsMenu');
    if (getComputedStyle(settingsMenu).opacity === "1") {
        pop(settingsMenu, false);
    } else {
        pop(settingsMenu, true);
    }
}