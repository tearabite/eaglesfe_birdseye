var ws = new WebSocket('ws://localhost:40510?name=producer');
ws.name = 'producer';
// event emmited when connected
ws.onopen = function () {
    console.log('websocket is connected ...');
};

// event emmited when receiving message 
ws.onmessage = function (ev) {
};

dragElement(document.querySelector('#robotDiv'));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        startX = 0,
        startY = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        startX = e.clientX;
        startY = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = startX - e.clientX;
        pos2 = startY - e.clientY;
        startX = e.clientX;
        startY = e.clientY;
        // set the element's new position:
        let top = Math.max(-18, Math.min(270, elmnt.offsetTop - pos2)) + (elmnt.offsetHeight / 2);
        let left = Math.max(-18, Math.min(270, elmnt.offsetLeft - pos1)) + (elmnt.offsetWidth / 2);
        elmnt.style.top = top - (elmnt.offsetHeight / 2) + "px";
        elmnt.style.left = left - (elmnt.offsetWidth / 2) + "px";
        var packet = {
            x: (left / 2) - 72,
            y: (top / 2) - 72
        };
        ws.send(JSON.stringify(packet));
        console.log(packet);
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

