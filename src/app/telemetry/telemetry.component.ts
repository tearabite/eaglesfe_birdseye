import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TelemetryService, Telemetry } from '../telemetry.service'
import { CodemirrorComponent } from '@ctrl/ngx-codemirror'

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css'],
})
export class TelemetryComponent implements OnInit {
  @ViewChild('raw') raw: CodemirrorComponent;
  @Input() maxBufferLength: number = 100;

  private currentFrame: Telemetry;

  constructor(private telemetryService: TelemetryService) {
  }

  private onConnectDisconnectClicked() {
    if (this.telemetryService.isConnected) {
      this.telemetryService.disconnect();
    }
    else {
      this.telemetryService.connect('ws://localhost:8080');
      TelemetryService.messages.subscribe(msg => this.currentFrame = msg );
      console.log("Trying to connect...");}
  }

  ngOnInit() { 
  }
}
