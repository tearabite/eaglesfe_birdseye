
pop = (element, direction) => {
    if (direction === 'in') {
        element.classList.remove('closed');
        element.classList.add('open');
    } else {
        element.classList.add('closed');
        element.classList.remove('open');
    }
};

var controls;
document.addEventListener('mouseover', (e) => {
    if (controls !== undefined) {
        controls.enabled = e.path[0].tagName === 'CANVAS';
    }
});

(function settings () {
    const settingsButton = document.getElementById('settingsButton');
    const settingsMenu = document.getElementById('settingsMenu');
    const saveButton = document.querySelector('#settingsMenu .buttons .button[name="save"]');
    const cancelButton = document.querySelector('#settingsMenu .buttons .button[name="cancel"]');

    settingsButton.addEventListener('click', () => {
        if (getComputedStyle(settingsMenu).visibility === 'visible') {
            pop(settingsMenu, 'out');
        } else {
            reveal();
        }
    });

    var reveal = () => {
        getConfiguration((args) => {
            let settings = settingsMenu.querySelectorAll('.param input');
            settings.forEach(setting => {
                let key = setting.getAttribute('name');
                let value = args[key];
                if (value !== undefined) {
                    switch (setting.getAttribute('type')) {
                        case 'text':
                            setting.value = value;
                            break;
                        case 'checkbox':
                            setting.checked = value;
                            break;
                    }
                    setting.value = value;
                }
            })
            pop(settingsMenu, 'in');
        });
    };
    var dismiss = (save) => {
        if (save === true) {
            let settings = settingsMenu.querySelectorAll('.param input');
            let newArgs = {};
            settings.forEach(setting => {
                let key = setting.getAttribute('name');
                let value;
                switch (setting.getAttribute('type')) {
                    case 'text':
                        value = setting.value
                        break;
                    case 'checkbox':
                        value = setting.checked;
                        break;
                }
                newArgs[key] = value;
            })
            setConfiguration(newArgs);
        }
        pop(settingsMenu, 'out');
    };

    cancelButton.addEventListener('click', () => {
        dismiss(false);
    });
    saveButton.addEventListener('click', () => {
        dismiss(true);
    });

})();

(function rightRail () {
    var codemirrorOptions = {
        lineWrapping: true,
        readOnly: true,
        cursorBlinkRate: -1
    };

    const pane = document.getElementById('rightRail');
    const hud = CodeMirror(pane.querySelector('.raw'), codemirrorOptions);
    const log = CodeMirror(pane.querySelector('.log'), codemirrorOptions);
    const cmd = pane.querySelector('#cmd');
    const connectButton = document.querySelector('#rightRail #toolbar #connect');
    let ws;
    connectButton.addEventListener('click', () => {
        if (ws && ws.readyState === ws.OPEN) {
            ws.close();
        }
        else {
            getConfiguration((args) => {
                console.log(`CONNECTING... - ${args.address}:${args.port}.`);

                connectButton.classList.remove('disconnected');
                connectButton.classList.add('connecting');
                ws = connect(args.address, args.port, () => {
                    connectButton.classList.remove('connecting');
                    connectButton.classList.add('connected');
                    console.log(`CONNECTED! - ${args.address}:${args.port}.`);
                }, (message) => {
                    const oldPos = hud.getScrollInfo().top
                    hud.setValue(JSON.stringify(message, null, 2));
                    hud.scrollTo(0, oldPos);
                    telemetry = telemetry || {};
                    Object.assign(telemetry, message);
                }, () => {
                    connectButton.classList.remove('connected');
                    connectButton.classList.remove('connecting');
                    connectButton.classList.add('disconnected');
                    ws = undefined;
                    console.log(`DISCONNECTED! - ${args.address}:${args.port}.`);
                });
            });
        }
    });

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

    function noScroll(e) {
        if (e.target.tagName.toUpperCase() !== 'CANVAS') {
            e.preventDefault();
        }
    }
    document.addEventListener('touchmove', noScroll, { passive: false});

    pop(pane, 'in');
})();


