import { Component, OnInit } from '@angular/core';
import { Game, GameProviderService } from '../gameprovider.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-game-picker',
  templateUrl: './game-picker.component.html',
  styleUrls: ['./game-picker.component.css']
})
export class GamePickerComponent implements OnInit {
  private games: Array<Game>;

  constructor(private gameProvider: GameProviderService) {
    gameProvider.getGames().subscribe((games: Array<Game>) => this.games = games);
  }

  ngOnInit() {
  }

  onSelectedGameChanged({ value }) {
    this.gameProvider.selectGame(value);
  }
}
