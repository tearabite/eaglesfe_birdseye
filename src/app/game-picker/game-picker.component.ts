import { Component, OnInit } from '@angular/core';
import { Game, GameProviderService } from '../gameprovider.service';
import { Observable, Subject } from 'rxjs';
import { PreferencesService } from '../preferences.service';

@Component({
  selector: 'app-game-picker',
  templateUrl: './game-picker.component.html',
  styleUrls: ['./game-picker.component.css']
})
export class GamePickerComponent implements OnInit {
  private games: Array<Game>;

  constructor(private gameProvider: GameProviderService, private preferencesService: PreferencesService) {
    gameProvider.getGamesList().subscribe((games: Array<Game>) => this.games = games);
  }

  ngOnInit() {
  }

  onSelectedGameChanged({ value }) {
    this.gameProvider.game = value;
  }
}
