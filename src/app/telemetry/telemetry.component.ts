import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TelemetryService, Telemetry } from '../telemetry.service'
import { CodemirrorComponent } from '@ctrl/ngx-codemirror'
import { timer } from 'rxjs';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css'],
})
export class TelemetryComponent implements OnInit {
  @ViewChild('raw') raw: CodemirrorComponent;
  @Input() maxBufferLength: number = 100;

  private watchdogInterval: number;
  private maxWatchdogInterval: number = 2000;
  private currentFrame: Telemetry;
  private paused: boolean;
  
  constructor(private telemetryService: TelemetryService) {
  }

  private onConnectDisconnectClicked() {
    if (this.telemetryService.isConnected) {
      this.telemetryService.disconnect();
    }
    else {
      this.telemetryService.connect('ws://localhost:8080');
      TelemetryService.messages.subscribe(msg => this.onFrameReceived(msg));
    }
  }

  public get isConnected() {
    return this.telemetryService.isConnected;
  }
  
  private onFrameReceived(frame) {
    this.currentFrame = frame
  }

  public pause() : void {
    this.paused = true;
  }

  public unpause() : void {
    this.paused = false;
  }

  ngOnInit() { 
  }
}
