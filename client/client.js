// WebSocket Setup
var ws = new WebSocket('ws://localhost:40510');
ws.onopen = () => console.log('Bird\'s Eye is Watching...');
var pos;
ws.onmessage = (ev) => pos = JSON.parse(ev.data);

// Basic Scene Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

var controls = new THREE.OrbitControls( camera );
camera.position.set( 0, -185, 135 );
controls.update();

document.body.appendChild(renderer.domElement);

// First, setup a plane so it doesn't look like the field is floating in space
var geometry = new THREE.PlaneGeometry( 500, 500 );
var texture = new THREE.TextureLoader().load( 'img/gym_floor.png' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var plane = new THREE.Mesh( geometry, material );
plane.position.set(0,0,-1);
scene.add( plane );

// Lights
var dLight = new THREE.DirectionalLight();
scene.add( dLight );
var hLight = new THREE.HemisphereLight();
scene.add( hLight );

spotLight = new THREE.SpotLight( 0xffffff, 1 );
spotLight.position.set( -100, 100, 50 );
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.05;
spotLight.decay = 2;
spotLight.distance = 300;
spotLight.castShadow = true;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 2000;

spotLight2 = new THREE.SpotLight( 0xffffff, 1 );
spotLight2.position.set( 100, 100, 50 );
spotLight2.angle = Math.PI / 4;
spotLight2.penumbra = 0.05;
spotLight2.decay = 2;
spotLight2.distance = 300;
spotLight2.castShadow = true;
spotLight2.shadow.camera.near = 10;
spotLight2.shadow.camera.far = 2000;

scene.add( spotLight );
scene.add( spotLight2 );
           
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
    if (pos !== undefined) {
        robot.position.set(pos.x, -pos.y, 9.5);
        // const pitch = THREE.Math.degToRad(pos.pitch);
        // const roll = THREE.Math.degToRad(pos.roll);
        // const heading = THREE.Math.degToRad(pos.heading);
        // robot.rotation.setFromVector3(new THREE.Vector3(roll, pitch, heading));
    }
    
	renderer.render( scene, camera );
}

var robot = new RobotMesh();
scene.add(robot);

spotLight.target = robot;
spotLight2.target = robot;

animate();