import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import { SceneComponent } from './scene.component'

export class ThreeHelpers {
    public static readonly xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
    public static readonly yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
    public static readonly zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);

    public static readonly models_BasePath: string = 'assets\\models';
    public static readonly models_FieldPath: string = `${ThreeHelpers.models_BasePath}\\ftc_field.glb`;

    public static addModelToScene(component: SceneComponent, filename: string): void {
        const loader = new GLTFLoader();
        loader.load(filename,
            /*onload*/
            (model: GLTF) => {
                model.scene.traverse(child => {
                    child.castShadow = true;
                    child.receiveShadow = true;
                })
                model.scene.rotateX(THREE.Math.degToRad(90));
                model.scene.rotateY(THREE.Math.degToRad(-90));
                model.scene.up = ThreeHelpers.zAxis;

                component.addModel(model);
            },
            /*progress*/
            (e: ProgressEvent) => {
                console.log(e);
            },
            /*onerror*/
            (e: ErrorEvent) => {
                console.log(e);
            });
    }
}
