import { Injectable, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Object3D } from 'three';
import { ThreeHelpers } from './util/threehelpers';
import { forEach } from '@angular/router/src/utils/collection';
import * as THREE from 'three';


@Injectable({
  providedIn: 'root'
})
export class GameProviderService {
  private games: Array<Game>;

  private _game: Game;
  public current = new Subject<Game>();
  
  constructor(private http: HttpClient) {
    this.http.get('assets/games.json').subscribe((games: Array<Game>) => this.games = games);
  }

  get game() : Game {
    return this._game;
  }

  set game(game: Game) {
    this._game = game;
    this.current.next(game);
  }

  public getGamesList() {
    return this.http.get('assets/games.json');
  }

  public async getAssetsForGame(game: Game) : Promise<Array<Object3D>> {
    if (game === undefined) {
      throw new Error("Attempted to load an undefined game.");
    }

    const models = [];
    for (let i = 0; i < game.models.length; i++) {
      const modelInfo = game.models[i] as ModelInfo;
      const model = await ThreeHelpers.loadModel(modelInfo.path)

      if (modelInfo.rotation) {
        const rx = modelInfo.rotation[0] && THREE.Math.degToRad(modelInfo.rotation[0]) || 0;
        const ry = modelInfo.rotation[1] && THREE.Math.degToRad(modelInfo.rotation[1]) || 0;
        const rz = modelInfo.rotation[2] && THREE.Math.degToRad(modelInfo.rotation[2]) || 0;
        model.rotateX(rx);
        model.rotateY(ry);
        model.rotateZ(rz);
      }
      models.push(model);
    }

    return models;
  }
}

export class ModelInfo {
  path: string
  rotation?: Array<number>
  translation?: Array<number>
}

export class Game {
  name: string;
  season: number;
  models: Array<ModelInfo> | Array<string>;
  description?: string;
}
