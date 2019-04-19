import { Injectable } from '@angular/core';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import { Subject } from 'rxjs';

class Models {
  public static readonly basePath: string = 'assets\\models';

  public static readonly ftc = {
    field: `${Models.basePath}\\ftc_field.glb`
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModelProviderService {
  loading: Subject<ProgressEvent> = new Subject<ProgressEvent>();
  loaded: Subject<THREE.Object3D> = new Subject<THREE.Object3D>();
  loadError: Subject<ErrorEvent> = new Subject<ErrorEvent>();

  constructor() {

  }

  requestModel(modelPath: string) {
    const loader = new GLTFLoader();
    loader.load(modelPath,
      (model: GLTF) => this.loaded.next(model.scene),
      (progress: ProgressEvent) => this.loading.next(progress),
      (error: ErrorEvent) => this.loadError.next(error));
  }

  static Models = Models;
}

export class ThreeHelpers {
  public static readonly xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
  public static readonly yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  public static readonly zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
}
