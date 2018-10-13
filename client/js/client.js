var ws = new WebSocket('ws://localhost:40510')
ws.name = 'client';
// event emmited when connected
ws.onopen = function () {
    console.log('Bird\'s Eye is Watching...');
};

var pos;
// event emmited when receiving message 
ws.onmessage = function (ev) {
    console.log(ev);
    pos = JSON.parse(ev.data);
};

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
  }

content = JSON.parse(loadFile("sample.json"));

// Basic Scene Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls( camera );
camera.position.set( 0, -160, 20 );
controls.update();

// Lights
var dLight = new THREE.DirectionalLight();
scene.add( dLight );
var hLight = new THREE.HemisphereLight();
scene.add( hLight );

// Setup the static (unchanging) parts of the field
// First, setup a plane so it doesn't look like the field is floating in space
var geometry = new THREE.PlaneGeometry( 500, 500 );
var texture = new THREE.TextureLoader().load( 'img/gym_floor.png' );
var material = new THREE.MeshBasicMaterial( { map: texture } );
var plane = new THREE.Mesh( geometry, material );
plane.position.set(0,0,-1);
scene.add( plane );
// Load the 3D model(s) for the field
var loader = new THREE.STLLoader();

var tileMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
var wallFrameMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } );

var fieldParts = [
    { 
        model: 'models/parts/field_tiles.stl', 
        material: new THREE.MeshPhongMaterial({ color: 0xAAAAAA}),
        rotation:  { x: 90 }
    },
    { 
        model: 'models/parts/field_walls_metal.stl', 
        material: new THREE.MeshPhongMaterial({ color: 0x000000 }),
        rotation:  { x: 90 },
    },
    { 
        model: 'models/parts/field_walls_glass.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0xAAAAAA, opacity: 0.3, transparent: true }),
        rotation:  { x: 90 },
    },        
    { 
        model: 'models/parts/rr_crater_wall.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0x111111 }),
        rotation:  { x: 90, y: 90 },
        translation: new THREE.Vector3(-48.5, -46, 0)
    },   
    { 
        model: 'models/parts/rr_crater_wall.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0x111111 }),
        rotation:  { x: 90, y: -90 },
        translation: new THREE.Vector3(48.5, 46, 0)
    },  
    { 
        model: 'models/parts/rr_lander_tape.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0xFF1111 }),
        rotation:  { x: 90, y: -135 },
        translation: new THREE.Vector3(0, 0, 1)
    },  
    { 
        model: 'models/parts/rr_depot_tape.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0xFF1111 }),
        rotation:  { x: 90 },
        translation: new THREE.Vector3(59, -60, 1)
    },  
    { 
        model: 'models/parts/rr_lander_tape.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0x1111FF }),
        rotation:  { x: 90, y: 45 },
        translation: new THREE.Vector3(0, 0, 1)
    },  
    { 
        model: 'models/parts/rr_depot_tape.stl', 
        material: new THREE.MeshBasicMaterial({ color: 0x1111FF }),
        rotation:  { x: 90 },
        translation: new THREE.Vector3(-59, 60, 1)
    },  
];
var field = [];
function addPartToScene(settings) {
    loader.load(settings.model, function (geometry) {
        let mesh = new THREE.Mesh(geometry, settings.material);

        rotation = settings.rotation;
        mesh.rotation.set(
            rotation && rotation.x && THREE.Math.degToRad(rotation.x) || 0,
            rotation && rotation.y && THREE.Math.degToRad(rotation.y) || 0,
            rotation && rotation.z && THREE.Math.degToRad(rotation.z) || 0);    
        mesh.updateMatrix(); // Must update the rotation matrix so the subsequent translations work.

        mesh.geometry.computeBoundingBox();
        let boundingBox = mesh.geometry.boundingBox.applyMatrix4(mesh.matrix);
        let zeroingVector = new THREE.Vector3(
            (boundingBox.max.x - boundingBox.min.x) / -2, 
            (boundingBox.max.y - boundingBox.min.y) / -2, 
            0);

        if (settings.translation){
            zeroingVector.add(settings.translation);
        }

        mesh.receiveShadow = true;
        mesh.castShadow = true;
        mesh.position.set(zeroingVector.x - boundingBox.min.x, zeroingVector.y - boundingBox.min.y, zeroingVector.z - boundingBox.min.z);
        let name = settings.model.split('\\').pop().split('/').pop();
        scene.add(mesh);
        field[name] = mesh;
    }, 
    undefined, 
    err => console.error(err));
}

var robotBox = new THREE.CubeGeometry(18,18,18);
var robotMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
var robot = new THREE.Mesh(robotBox, robotMaterial);
robot.position.z = 9;
scene.add(robot);

fieldParts.forEach(part => addPartToScene(part));
var axesHelper = new THREE.AxesHelper( 200 );
scene.add( axesHelper );

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
animate();