import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GameProviderService {
  private games: Array<Game>;

  selectedGame: Subject<Game> = new Subject<Game>();

  constructor(private http: HttpClient) {
    this.http.get('assets/games.json').subscribe((games: Array<Game>) => this.games = games);
  }

  getGames() {
    return this.http.get('assets/games.json');
  }

  selectGame(game: Game) {
    this.selectedGame.next(game);
  }
}

export class Game {
  name: string;
  season: number;
  models: Array<string>;
  description?: string;
}
