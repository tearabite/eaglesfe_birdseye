class RobotPlaceholder {
    get dimensions() {
        return { width: 18, height: 18, depth: 18 };
    };

    constructor() {
        this.robot = new THREE.Group();

        let cube = new THREE.BoxBufferGeometry(this.dimensions.width, this.dimensions.height, this.dimensions.depth);
        cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, this.dimensions.depth / 2));
        this.robot.add(new THREE.Mesh(
            cube,
            new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true })
        ));

        let cone = new THREE.ConeGeometry(9, 9, 32);
        cone.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / -2));
        cone.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimensions.width - 4.5, 0, this.dimensions.depth / 2));

        this.robot.add(new THREE.Mesh(
            cone,
            new THREE.MeshPhongMaterial({ color: 0xFF0000, dithering: true })
        ));
        this.robot.translateZ(new THREE.Matrix4().makeTranslation(0, 0, this.dimensions.depth));

        this.robot.receiveShadow = true;
        this.robot.castShadow = true;
    }

    set grid (value) {
        let grid = this.robot.getObjectByName("grid");
        if (value === true) {
            if (grid === undefined) {
                grid = new THREE.GridHelper(72, 6);
                grid.rotateX(Math.PI / 2);
                grid.translateY(0.5);
                grid.name = "grid";
                this.robot.add(grid);
            }
            grid.visible = true;
        } else {
            if (grid !== undefined) {
                grid.visible = false;
            }
        }
    }

    set axes (value) {
        let axes = this.robot.getObjectByName("robotAxes");
        if (value === true) {
            if (axes === undefined) {
                axes = new THREE.AxesHelper(72);
                axes.name = "robotAxes";
                this.robot.add(axes);
            }
            axes.visible = true;
        } else {
            if (axes !== undefined) {
                axes.visible = false;
            }
        }
    }

    get object() {
        return this.robot;
    }

    update (telemetry) {
        const position = telemetry.position;
        if (position) {
            this.object.position.set(position.x, position.y, 0);
            const pitch = THREE.Math.degToRad(position.pitch * -1);
            const roll = THREE.Math.degToRad(position.roll * -1);
            const heading = THREE.Math.degToRad(position.heading);
            this.object.rotation.setFromVector3(new THREE.Vector3(roll, pitch, heading));
        }
    }
}