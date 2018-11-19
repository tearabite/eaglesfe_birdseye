class TargetPin {
    constructor(color) {
        this.color = color;
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

        let pin = new THREE.Group();
        pin.add(cylinder);
        pin.add(cone);

        return pin;
    }
}