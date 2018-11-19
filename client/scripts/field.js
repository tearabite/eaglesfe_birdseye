class Field {
    constructor() {
        this.init();
    }

    init () {

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
    }

    set axes (value) {
        let axes = scene.getObjectByName("fieldAxes");
        if (value === true) {
            if (axes === undefined) {
                axes = new THREE.AxesHelper(72);
                axes.name = "fieldAxes";
                scene.add(axes);
            }
            axes.visible = true;
        } else {
            if (axes !== undefined) {
                axes.visible = false;
            }
        }
    }
}

var loadGlb = (path, done) => {
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