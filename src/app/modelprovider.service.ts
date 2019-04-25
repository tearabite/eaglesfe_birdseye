import { Injectable } from '@angular/core';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import { Subject } from 'rxjs';
import { GameProviderService, Game } from './gameprovider.service';

class Models {
  public static readonly basePath: string = 'assets\\models';

  public static readonly ftc = {
    field: 'ftc_field.glb'
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModelProviderService {
  loading: Subject<ProgressEvent> = new Subject<ProgressEvent>();
  loaded: Subject<THREE.Object3D> = new Subject<THREE.Object3D>();
  loadError: Subject<ErrorEvent> = new Subject<ErrorEvent>();
  removed: Subject<string> = new Subject<string>();

  private loadedGame: Game;
  private loadedModelPathIdentifierMap: Map<string, string> = new Map<string, string>();

  constructor(private gameProvider: GameProviderService) {
    gameProvider.selectedGame.subscribe((game: Game) => {
      if (this.loadedGame != undefined) {
        this.loadedGame.models.forEach(path => {

          const uuid = this.loadedModelPathIdentifierMap.get(path);
          this.removed.next(uuid);
          this.loadedModelPathIdentifierMap.delete(path);
        });
      }

      this.loadedGame = game;
      game.models.forEach(path => {
        this.loadModel(path);
      });
    });
  }

  loadModel(modelPath: string) {
    const loader = new GLTFLoader();
    loader.load(`${Models.basePath}\\${modelPath}`,
      (model: GLTF) => {
        this.loaded.next(model.scene)
        this.loadedModelPathIdentifierMap.set(modelPath, model.scene.uuid);
      },
      (progress: ProgressEvent) => this.loading.next(progress),
      (error: ErrorEvent) => this.loadError.next(error));
  }

  buildRobot() {
    const width = 18;
    const height = 18;
    const depth = 18;

    const group = new THREE.Group();
    const cube = ThreeHelpers.dropCube(width, height, depth);
    const cone = new THREE.ConeGeometry(width / 2, height / 2, 32);

    cone.applyMatrix(new THREE.Matrix4().makeTranslation(width / -2, height / 2, 0));
    cone.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / -2));

    group.add(new THREE.Mesh(cube, new THREE.MeshPhongMaterial({ color: 0x4080ff, dithering: true })));
    group.add(new THREE.Mesh(cone, new THREE.MeshPhongMaterial({ color: 0xFF0000, dithering: true })));

    group.receiveShadow = true;
    group.castShadow = true;

    this.loaded.next(group);
  }

  static Models = Models;
}

export class ThreeHelpers {
  public static readonly xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
  public static readonly yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  public static readonly zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);

  public static dropCube(width: number, height: number, depth: number) {
    const cube = new THREE.BoxBufferGeometry(width, height, depth);
    cube.applyMatrix(new THREE.Matrix4().makeTranslation(0, height / 2, 0));
    return cube;
  }
}
