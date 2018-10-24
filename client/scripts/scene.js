var telemetry;

if (log && log.log) {
    var clog = console.log;
    console.error = console.warn = console.info = console.debug = console.log = (message) => {
        clog(message);
        log.log(message);
    }
}

// Basic Scene Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up = new THREE.Vector3(0,0,1);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
camera.aspect = window.innerWidth / window.innerHeight;
camera.setViewOffset(window.innerWidth * .75, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
camera.position.set( 0, -185, 135 );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var controls = new THREE.OrbitControls( camera );
controls.zoomSpeed = 0.2;
controls.maxPolarAngle = THREE.Math.degToRad(80);
controls.minPolarAngle = THREE.Math.degToRad(0);
controls.update();

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.setViewOffset(window.innerWidth * .75, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
  });

// First, setup a plane so it doesn't look like the field is floating in space
console.log('Loading ground plane...');
var geometry = new THREE.PlaneGeometry( 500, 500 );
var texture = new THREE.TextureLoader().load('img/gym_floor.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat = new THREE.Vector2(5, 5);
var material = new THREE.MeshBasicMaterial( { map: texture } );
var plane = new THREE.Mesh( geometry, material );
plane.position.set(0,0,-1);
scene.add( plane );

// Lights
console.log('Adding lights to scene...');
var dLight = new THREE.DirectionalLight();
scene.add( dLight );
var hLight = new THREE.HemisphereLight();
scene.add( hLight );

spotLight = new THREE.SpotLight( 0xddeeee, 1 );
spotLight.position.set(0, 0, 150 );
spotLight.angle = 1;
spotLight.penumbra = 0.05;
spotLight.decay = 2;
spotLight.distance = 300;
spotLight.castShadow = true;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 200;
spotLight.intensity = 0.5;

scene.add( spotLight );

console.log('Loading robot model...');
var RobotMesh = function () {
    this.robotGeometry = new THREE.BoxBufferGeometry(18,18,18);
    this.robotMaterial = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true } );
    let robot = new THREE.Mesh(this.robotGeometry, this.robotMaterial);
    robot.receiveShadow = true;
    robot.castShadow = true;
    robot.position.z = 9;
    return robot;
};

var field = [];
fieldParts.forEach(part => addPartToScene(part, scene, field));

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

var robot = new RobotMesh();
robot.position.set(30,-30, 9.5);
scene.add(robot);
animate();