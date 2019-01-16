class TargetPin {
    constructor(color) {
        let pinMaterial = new THREE.MeshPhongMaterial({ color: color });

        const coneHeight = 3;
        const cylinderHeight = 1;

        let cylinder = new THREE.CylinderGeometry(1, 1, cylinderHeight);
        let cone = new THREE.ConeGeometry(1, coneHeight);
        cone.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
        cylinder.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));

        cone.applyMatrix(new THREE.Matrix4().makeTranslation(0,0, coneHeight/2));
        cylinder.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, (cylinderHeight / 2) + coneHeight));

        cylinder = new THREE.Mesh(cylinder, pinMaterial);
        cone = new THREE.Mesh(cone, pinMaterial);

        this.pin = new THREE.Group();
        this.pin.add(cylinder);
        this.pin.add(cone);

        return this;
    }

    get color () {
        return this.pin.children[0].material.color;
    }

    set color (value) {
        this.pin.children.forEach(c => c.material.color = value);
    }

    get position() {
        let position = this.pin.position;
        return { x: position.x, y: position.y, z: position.z };
    }

    set position(value) {
        this.pin.position.set(value.x, value.y, value.z);
    }
}
var targets = [];

function updateTargets(t) {
    while (targets.length > t.length) {
        scene.remove(targets.pop().pin);
    }

    for (let i = 0; i < t.length; i++) {
        let pin = targets[i];
        if (pin === undefined) {
            pin = new TargetPin(t.color);
            targets.push(pin);
            scene.add(pin.pin);
        }
        pin.position = { x: t[i].x || 0, y: t[i].y || 0, z: t[i].z || 0 };
        if (t[i].color) {
            pin.color = new THREE.Color(t[i].color);
        }
    }
}

function enableTargets(value) {
    targets.forEach(target => {
        target.pin.visible = value;
    })
}