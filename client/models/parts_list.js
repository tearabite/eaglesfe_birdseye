fieldParts = [
    {
        model: 'models/parts/field_tiles.stl',
        material: new THREE.MeshPhongMaterial({ color: 0xAAAAAA, dithering: true}),
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
        hideShadow: true
    },
    {
        model: 'models/parts/rr_crater_wall.stl',
        material: new THREE.MeshPhongMaterial({ color: 0x111111, dithering: true }),
        rotation:  { x: 90, y: 90 },
        translation: new THREE.Vector3(-48.5, -46, 0.4)
    },
    {
        model: 'models/parts/rr_crater_wall.stl',
        material: new THREE.MeshPhongMaterial({ color: 0x111111, dithering: true }),
        rotation:  { x: 90, y: -90 },
        translation: new THREE.Vector3(48.5, 46, 0.4)
    },
    {
        model: 'models/parts/rr_lander_tape.stl',
        material: new THREE.MeshBasicMaterial({ color: 0xFF1111 }),
        rotation:  { x: 90, y: -135 },
        translation: new THREE.Vector3(0, 0, 0.4)
    },
    {
        model: 'models/parts/rr_depot_tape.stl',
        material: new THREE.MeshBasicMaterial({ color: 0xFF1111 }),
        rotation:  { x: 90 },
        translation: new THREE.Vector3(59, -60, 0.4)
    },
    {
        model: 'models/parts/rr_lander_tape.stl',
        material: new THREE.MeshBasicMaterial({ color: 0x1111FF }),
        rotation:  { x: 90, y: 45 },
        translation: new THREE.Vector3(0, 0, 0.4)
    },
    {
        model: 'models/parts/rr_depot_tape.stl',
        material: new THREE.MeshBasicMaterial({ color: 0x1111FF }),
        rotation:  { x: 90 },
        translation: new THREE.Vector3(-59, 60, 0.4)
    },
    {
        model: 'models/parts/rr_lander_reduced.stl',
        material: new THREE.MeshPhysicalMaterial({ color: 0x4C4C4C }),
        rotation:  { x: 90, y: 45 },
        translation: new THREE.Vector3(0, 0, 0),
        outline: new THREE.LineBasicMaterial( { color: 0x777777 } )
    },
];

var loader = new THREE.STLLoader();
function addPartToScene(settings, scene, storage) {
    loader.load(settings.model, function (geometry) {
        console.log(`Loading ${settings.model}`);
        let mesh = new THREE.Mesh(geometry, settings.material);
        mesh.receiveShadow = settings.hideShadow !== true;
        mesh.castShadow = settings.hideShadow !== true;

        if (settings.outline) {
            let group = new THREE.Group();
            group.add(mesh);
            var edges = new THREE.EdgesGeometry( geometry );
            var line = new THREE.LineSegments( edges, settings.outline);
            group.add(line);
            mesh = group;
        }

        rotation = settings.rotation;
        mesh.rotation.set(
            rotation && rotation.x && THREE.Math.degToRad(rotation.x) || 0,
            rotation && rotation.y && THREE.Math.degToRad(rotation.y) || 0,
            rotation && rotation.z && THREE.Math.degToRad(rotation.z) || 0);
        mesh.updateMatrix(); // Must update the rotation matrix so the subsequent translations work.

        geometry.computeBoundingBox();
        let boundingBox = geometry.boundingBox.applyMatrix4(mesh.matrix);
        let zeroingVector = new THREE.Vector3(
            (boundingBox.max.x - boundingBox.min.x) / -2,
            (boundingBox.max.y - boundingBox.min.y) / -2,
            0);

        if (settings.translation){
            zeroingVector.add(settings.translation);
        }

        mesh.position.set(zeroingVector.x - boundingBox.min.x, zeroingVector.y - boundingBox.min.y, zeroingVector.z - boundingBox.min.z);
        let name = settings.model.split('\\').pop().split('/').pop();
        scene.add(mesh);
        storage[name] = mesh;
    },
    undefined,
    err => console.error(err));
}