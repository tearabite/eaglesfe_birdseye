
pop = (element, direction) => {
    element.animate([
        {
            opacity: 0,
            transform: 'scale(0)',
            visibility: 'hidden'
        },
        {
            opacity: 0,
            transform: 'scale(0.7)',
            visibility: 'visible'
        },
        {
            transform: 'scale(1.2)',
            opacity: 1,
            easing: 'ease-out',
            visibility: 'visible'
        },
        {
            transform: 'scale(1.0)',
            opacity: 1,
            easing: 'ease-in',
            visibility: 'visible'

        }],
        {
            duration: 350,
            fill: 'both',
            direction: (direction === 'in' ? 'normal' : 'reverse'),
        })
    ;
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

(function settings () {
    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');
    settingsButton.addEventListener('click', () => {
        if (getComputedStyle(settingsMenu).visibility === 'visible') {
            pop(settingsMenu, 'out');
        } else {
            reveal();
        }
    });
    var reveal = () => {
        var settingsMenu = document.getElementById('settingsMenu');
        getConfiguration((args) => {
            document.querySelector('input[name="address"]').value = args.address;
            document.querySelector('input[name="port"]').value = args.port;
            document.querySelector('input[name="debug"]').checked = args.debug;
            pop(settingsMenu, 'in');
        });
    };
    var dismiss = (save) => {
        var settingsMenu = document.getElementById('settingsMenu');
        getConfiguration((args) => {
            document.querySelector('input[name="address"]').value = args.address;
            document.querySelector('input[name="port"]').value = args.port;
            document.querySelector('input[name="debug"]').checked = args.debug;
            pop(settingsMenu, 'in');
        });
    };
})();

(function rightRail () {
    var codemirrorOptions = {
        lineWrapping: true,
        readOnly: true,
        cursorBlinkRate: -1
    };

    const pane = document.getElementById('rightRail');
    const hud = CodeMirror(pane.querySelector('#hud'), codemirrorOptions);
    const log = CodeMirror(pane.querySelector('#log'), codemirrorOptions);
    const cmd = pane.querySelector('#cmd');

    var clog = console.log;
    console.error = console.warn = console.info = console.debug = console.log = (message) => {
        clog(message);
        log.setValue(log.getValue() + '\n' + message);
        log.execCommand('goDocEnd');
    }

    cmd.addEventListener('change', (e) => {
        ws.send(JSON.stringify(cmd.value));
        cmd.value = '';
    });

    pop(pane, 'in');
})();