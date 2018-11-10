
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
    const addressBox = document.querySelector('input[name="address"]');
    const debugCheckbox = document.querySelector('input[name="debug"]');

    function updateAddressBoxDisableState() {
        if (debugCheckbox.checked === true) {
            addressBox.setAttribute('disabled', true);
            addressBox.value = 'localhost';
        }
        else {
            addressBox.removeAttribute('disabled');
        }
    }

    debugCheckbox.addEventListener('change', (e) => {
        updateAddressBoxDisableState();
    });

    settingsButton.addEventListener('click', () => {
        if (getComputedStyle(settingsMenu).visibility === 'visible') {
            pop(settingsMenu, 'out');
        } else {
            reveal();
        }
    });

    var reveal = () => {
        getConfiguration((args) => {
            addressBox.value = args.address;
            document.querySelector('input[name="port"]').value = args.port;
            debugCheckbox.checked = args.debug;
            updateAddressBoxDisableState();
            document.querySelector('input[name="open"]').checked = args.open;
            document.querySelector('input[name="http"]').value = args.http;
            pop(settingsMenu, 'in');
        });
    };
    var dismiss = (save) => {
        if (save === true) {
            const newSettings = {
                address: addressBox.value,
                port: document.querySelector('input[name="port"]').value,
                debug: debugCheckbox.checked,
                open: document.querySelector('input[name="open"]').checked,
                http: document.querySelector('input[name="http"]').value
            }
            setConfiguration(newSettings);
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
                    hud.setValue(JSON.stringify(message, null, 2));
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


