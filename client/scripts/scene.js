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
camera.position.set(0, 0, 135);
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

var field = new Field();

var targetPin = new TargetPin(0xffff00);
targetPin.visible = false;
scene.add(targetPin);

var robotTargetPin = new TargetPin(0xffffff);
robotTargetPin.visible = false;
robotTargetPin.translateZ(4);
scene.add(robotTargetPin);

var robot = new RobotPlaceholder();
robot.object.position.set(-60, 60, 0);
scene.add(robot.object);


var refreshRate = 0.250;
var clock = new THREE.Clock(true);
var timeUntilUpdate = 0.0;
var post0, postn;
function animate() {
    requestAnimationFrame(animate);

    timeUntilUpdate -= clock.getDelta();
    if (timeUntilUpdate <= 0) {
        timeUntilUpdate = refreshRate;

        if (telemetry) {
            post0 = postn;
            postn = telemetry.position;

            // const fTarget = telemetry.target && telemetry.target.field;
            // if (fTarget) {
            //     const x = fTarget.x || 0;
            //     const y = fTarget.y || 0;
            //     const z = fTarget.z || 0;
            //     targetPin.position.set(x, y, z);
            //     targetPin.visible = true;
            // } else {
            //     targetPin.visible = false;
            // }

            // const rTarget = telemetry.target && telemetry.target.robot;
            // if (fTarget) {
            //     const x = rTarget.x || 0;
            //     const y = rTarget.y || 0;
            //     const z = rTarget.z || 0;
            //     const transformed = robot.object.localToWorld(new THREE.Vector3(x, y, z));
            //     robotTargetPin.position.set(transformed.x, transformed.y, 4);
            //     robotTargetPin.visible = true;
            // } else {
            //     robotTargetPin.visible = false;
            // }
        }
    } else if (post0 && postn) {
        const t = Math.min(1, (refreshRate - timeUntilUpdate)/refreshRate);
        const post = {
            position: {
                x: THREE.Math.lerp(post0.x, postn.x, t),
                y: THREE.Math.lerp(post0.y, postn.y, t),
                z: THREE.Math.lerp(post0.z, postn.z, t),
                pitch: THREE.Math.lerp(post0.pitch, postn.pitch, t),
                roll: THREE.Math.lerp(post0.roll, postn.roll, t),
                heading: THREE.Math.lerp(post0.heading, postn.heading, t)
            }
        }
        robot.update(post);
    }

	renderer.render( scene, camera );
}

document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener('touchmove', (e) => {
    e.preventDefault();
});
animate();


var settingsUpdated = function (args) {
    robot.axes = args.robotAxes === true;
    robot.grid = args.robotGrid === true;
    field.axes = args.fieldAxes === true;
    refreshRate = args.refreshRate || refreshRate;
};

getConfiguration(args => {
    settingsUpdated(args);
})