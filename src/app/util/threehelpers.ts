import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'

export class ThreeHelpers {
  public static readonly xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
  public static readonly yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  public static readonly zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
  
  public static loadModel(modelPath: string, progressReporter?: Function) : Promise<THREE.Object3D> {
    if (progressReporter === undefined) {
      progressReporter = (p) => console.log(p);
    }
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(`${ThreeHelpers.Models.basePath}\\${modelPath}`,
      (model: GLTF) => { resolve(model.scene) },
      (progress: ProgressEvent) => progressReporter(progress),
      (error: ErrorEvent) => reject(error));
    });
  }

  static Models = class {
    public static readonly basePath: string = 'assets\\models';
  
    public static readonly ftc = {
      field: 'ftc_field.glb',
      curiosity_rover:'curiosity_rover.glb'
    }
  }
}
