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

var light = new THREE.DirectionalLight("#444444", 1);
var ambient = new THREE.AmbientLight("#444444");
var spotlight = new THREE.SpotLight("#444444");

spotlight.position.set(0, 0, 80);
spotlight.castShadow = true;
light.position.set( 0, -70, 100 ).normalize();
scene.add(light);
scene.add(ambient);
scene.add(spotlight);

var loader = new THREE.GLTFLoader();
loader.load('models/field.gltf', function (gltf) {
    gltf.scene.traverse(child => {
        child.castShadow = true;
        child.receiveShadow = true;
    });
    gltf.scene.rotateX(THREE.Math.degToRad(90));
    gltf.scene.up = new THREE.Vector3(0, 0, 1);
    scene.add(gltf.scene);
    animate();
},
undefined, (e) => {
    console.error(e);
});

function animate() {
    requestAnimationFrame( animate );

    controls.update();
    if (telemetry !== undefined) {
        robot.position.set(telemetry.x, telemetry.y, 9.5);
        const pitch = THREE.Math.degToRad(telemetry.pitch);
        const roll = THREE.Math.degToRad(telemetry.roll);
        const heading = THREE.Math.degToRad(telemetry.heading);
        robot.rotation.setFromVector3(new THREE.Vector3(roll, pitch, heading));
    }

	renderer.render( scene, camera );
}

var RobotMesh = function () {
    this.robotGeometry = new THREE.BoxBufferGeometry(18,18,18);
    this.robotMaterial = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true } );
    let robot = new THREE.Mesh(this.robotGeometry, this.robotMaterial);
    robot.receiveShadow = true;
    robot.castShadow = true;
    robot.position.z = 9;
    return robot;
};

var robot = new RobotMesh();
robot.position.set(30, -30, 9.5);
scene.add(robot);
document.body.appendChild(renderer.domElement);
