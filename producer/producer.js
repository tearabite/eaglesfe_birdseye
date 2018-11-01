class Robot {
    constructor(div) {
        this.element = div;

        const fieldSize = {
            width: this.element.parentElement.offsetWidth,
            height: this.element.parentElement.offsetHeight
        };

        const scale = fieldSize.width / 144;

        const size = {
            width: this.element.offsetWidth,
            height: this.element.offsetHeight
        };

        const positionLimits = {
            max: { x: (fieldSize.width - (size.width / 2)), y: (fieldSize.height - (size.height / 2)) },
            min: { x: size.width / 2, y: size.height / 2 }
        };

        this.move = (x, y) => {
            const currentPosition = this.getPosition();
            this.setPosition(currentPosition.x + x, currentPosition.y + y);
        };

        this.setPosition = (x, y) => {
            x = clamp(x, positionLimits.min.x, positionLimits.max.x);
            y = clamp(y, positionLimits.min.y, positionLimits.max.y);
            this.element.style.left = (x - size.width / 2) + 'px';
            this.element.style.top = (y - size.height / 2) + 'px';
        };

        this.getPosition = () => {
            return {
                x: this.element.offsetLeft + size.width / 2,
                y: this.element.offsetTop + size.height / 2
            };
        };

        this.getTransformedPosition = () => {
            const position = this.getPosition();
            return {
                x: (position.x / scale) - ((fieldSize.width / 2) / scale),
                y: -1 * ((position.y / scale) - ((fieldSize.height / 2) / scale))
            };
        };
    }
}

var field = document.querySelector('#fieldDiv');
var robot = new Robot(document.querySelector('#robotDiv'));
var ws;
getConfiguration((args) => {
    ws = connect(args.address, args.port);
});

dragElement(robot);

function dragElement(robot) {
    var x = 0, y = 0, prevX = 0, prevY = 0;
    robot.element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        prevX = e.clientX;
        prevY = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        x = e.clientX - prevX;
        y = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;

        robot.move(x, y);

        transformedPosition = robot.getTransformedPosition();
        ws.send(JSON.stringify(transformedPosition));
        console.log(transformedPosition);
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}
