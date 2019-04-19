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

  static Models = Models;
}

export class ThreeHelpers {
  public static readonly xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
  public static readonly yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  public static readonly zAxis: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
}
