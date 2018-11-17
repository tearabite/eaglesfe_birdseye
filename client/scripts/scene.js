var telemetry;

// Renderer
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up = new THREE.Vector3(0,0,1);
camera.aspect = window.innerWidth / window.innerHeight;
camera.setViewOffset(window.innerWidth * .75, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
camera.position.set(0, -185, 135);

window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.setViewOffset(window.innerWidth * .75, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
});

// Controls
var controls = new THREE.OrbitControls( camera );
controls.maxPolarAngle = THREE.Math.degToRad(80);
controls.minPolarAngle = THREE.Math.degToRad(0);
controls.update();

// Scene
var scene = new THREE.Scene();

// Define lights
var light = new THREE.DirectionalLight("#444444", 1);
var ambient = new THREE.AmbientLight("#444444");
var spotlight = new THREE.SpotLight("#444444");

spotlight.position.set(0, 0, 80);
spotlight.castShadow = true;
spotlight.penumbra = 0.06;
spotlight.intensity = 1.5;
light.position.set(0, -70, 100).normalize();

// Add lights
scene.add(light);
scene.add(ambient);
scene.add(spotlight);

var robot;

function loadGlb(path, done) {
    var loader = new THREE.GLTFLoader();
    loader.load(path, function (gltf) {
        gltf.scene.traverse(child => {
            child.castShadow = true;
            child.receiveShadow = true;
        });

        gltf.scene.rotateX(THREE.Math.degToRad(90));
        gltf.scene.rotateY(THREE.Math.degToRad(-90));
        gltf.scene.up = new THREE.Vector3(0, 0, 1);
        scene.add(gltf.scene);
        if (done !== undefined) {
            done(gltf);
        }
    },
    undefined, (e) => {
        console.error(e);
    });
}

// Get model assets and add them to the scene.
var assets;
const request = new XMLHttpRequest();
request.open("GET", 'assets');
request.send();
request.onreadystatechange = (e) => {
    if (request.readyState === 4 && request.responseText) {
        assets = JSON.parse(request.responseText);
        if (assets === undefined) {
            console.error("No field assets found. Nothing to render!")
        } else {
            // Load the generic field
            console.log(`Loading ----`)
            assets.generic.forEach(asset => {
                const name = asset.name;
                const path = asset.path;
                console.log(`\t+ ${name}`)
                loadGlb(path);
            });

            // Load game specific assets
            if (assets.games !== undefined && assets.games.length > 0) {
                const game = assets.games[0];
                if (game.assets !== undefined) {
                    console.log(`Loading game \"${game.name}\"`)
                    game.assets.forEach(asset => {
                        console.log(`\t+ ${asset.name}`)
                        loadGlb(asset.path);
                    });
                } else {
                    console.log(`No assets found for game \'${game.name}...`)
                }
            }

            // Load the user-provided robot model if it's specified
            if (assets.robot !== undefined) {
                loadGlb(assets.robot, (model => robot = model));
            }
        }
    }
}

// Target Pin
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

var targetPin = new TargetPin(0xffff00);
targetPin.visible = false;
scene.add(targetPin);

var robotTargetPin = new TargetPin(0xffffff);
robotTargetPin.visible = false;
robotTargetPin.translateZ(4);
scene.add(robotTargetPin);

class RobotPlaceholder {
    get dimensions() {
        return { width: 18, height: 18, depth: 18 };
    };

    constructor() {
        let robot = new THREE.Group();

        let cube = new THREE.BoxBufferGeometry(this.dimensions.width, this.dimensions.height, this.dimensions.depth);
        cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, this.dimensions.depth / 2));
        robot.add(new THREE.Mesh(
            cube,
            new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true })
        ));
        let cone = new THREE.ConeGeometry(9, 9, 32);
        cone.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / -2));
        cone.applyMatrix(new THREE.Matrix4().makeTranslation(this.dimensions.width - 4.5, 0, this.dimensions.depth / 2));
        robot.add(new THREE.Mesh(
            cone,
            new THREE.MeshPhongMaterial({ color: 0xFF0000, dithering: true })
        ));

        robot.translateZ(new THREE.Matrix4().makeTranslation(0, 0, this.dimensions.depth));

        robot.receiveShadow = true;
        robot.castShadow = true;
        robot.add(new THREE.AxisHelper(50));
        return robot;
    }
}

var robot = new RobotPlaceholder();
robot.position.set(-60, 60, 0);
scene.add(robot);

function animate() {
    requestAnimationFrame(animate);

    if (telemetry) {
        const position = telemetry.position;
        if (position) {
            robot.position.set(position.x, position.y, 0);
            const pitch = THREE.Math.degToRad(position.pitch * -1);
            const roll = THREE.Math.degToRad(position.roll * -1);
            const heading = THREE.Math.degToRad(position.heading);
            robot.rotation.setFromVector3(new THREE.Vector3(roll, pitch, heading));
        }

        const fTarget = telemetry.target && telemetry.target.field;
        if (fTarget) {
            const x = fTarget.x || 0;
            const y = fTarget.y || 0;
            const z = fTarget.z || 0;
            targetPin.position.set(x, y, z);
            targetPin.visible = true;
        } else {
            targetPin.visible = false;
        }

        const rTarget = telemetry.target && telemetry.target.robot;
        if (fTarget) {
            const x = rTarget.x || 0;
            const y = rTarget.y || 0;
            const z = rTarget.z || 0;
            const transformed = robot.localToWorld(new THREE.Vector3(x, y, z));
            robotTargetPin.position.set(transformed.x, transformed.y, 4);
            robotTargetPin.visible = true;
        } else {
            robotTargetPin.visible = false;
        }
    }

	renderer.render( scene, camera );
}

document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener('touchmove', (e) => {
    e.preventDefault();
});
animate();
