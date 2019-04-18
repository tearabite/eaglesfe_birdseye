import { Component, OnInit, ViewChild } from '@angular/core';
import { DebugService } from '../debug.service';
import { MatSlider } from '@angular/material/slider';
import { WebsocketService } from '../websocket.service';
import { TelemetryService } from '../telemetry.service';

@Component({
  selector: 'app-debugger',
  templateUrl: './debugger.component.html',
  styleUrls: ['./debugger.component.css'],
})
export class DebuggerComponent implements OnInit {

  interval: number = 100;

  constructor(private debugService: DebugService) { }

  ngOnInit() { }

  simulate(should: boolean) {
    if (should) {
      this.debugService.startSimulating();
    } else {
      this.debugService.stopSimulating();
    }
  }
}
