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
            assets.generic.forEach(asset => {
                const name = asset.name;
                const path = asset.path;
                console.log(`Loading \"${name}\" from \"${path}\"...`)
                loadGlb(path);
            });

            // Load game specific assets
            if (assets.games !== undefined && assets.games.length > 0) {
                const game = assets.games[0];
                if (game.assets !== undefined) {
                    console.log(`Loading game \'${game.name}...`)
                    game.assets.forEach(asset => {
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

class RobotPlaceholder {
    get dimensions() {
        return { width: 18, height: 18, depth: 18 };
    };

    constructor() {
        this.robotGeometry = new THREE.BoxBufferGeometry(this.dimensions.width, this.dimensions.height, this.dimensions.depth);
        this.robotGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, this.dimensions.depth / 2) );
        this.robotMaterial = new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true });
        let robot = new THREE.Mesh(this.robotGeometry, this.robotMaterial);
        robot.receiveShadow = true;
        robot.castShadow = true;
        return robot;
    }
}

var robot = new RobotPlaceholder();
scene.add(robot);

function animate() {
    requestAnimationFrame( animate );

    controls.update();
    if (telemetry !== undefined) {
        robot.position.set(telemetry.x, telemetry.y, 0);
        const pitch = THREE.Math.degToRad(telemetry.pitch);
        const roll = THREE.Math.degToRad(telemetry.roll);
        const heading = THREE.Math.degToRad(telemetry.heading);
        robot.rotation.setFromVector3(new THREE.Vector3(roll, pitch, heading));
    }

	renderer.render( scene, camera );
}

document.body.appendChild(renderer.domElement);
animate();
