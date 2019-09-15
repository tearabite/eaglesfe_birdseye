import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TelemetryService, Telemetry } from '../telemetry.service'
import { CodemirrorComponent } from '@ctrl/ngx-codemirror'
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css'],
})
export class TelemetryComponent implements OnInit {
  @ViewChild('raw') raw: CodemirrorComponent;
  @Input() maxBufferLength: number = 100;

  private currentFrame: Telemetry;
  private host = new FormControl('localhost', [Validators.pattern('(^localhost$|^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$)'), Validators.required]);
  private port = new FormControl('3708', [Validators.pattern('^[0-9]+$'), Validators.required]);

  constructor(private telemetryService: TelemetryService) {
    TelemetryService.messages.subscribe(msg => this.onFrameReceived(msg));
  }

  private onConnectDisconnectClicked() {
    if (this.telemetryService.isConnected) {
      this.telemetryService.disconnect();
    }
    else {  
      if (!(this.host.invalid || this.port.invalid)) {
        let address = `ws://${this.host.value}:${this.port.value}`;
        this.telemetryService.connect(address);
      }
    }
  }

  getErrorMessage(formInput) {
    if (formInput === this.host) {
      if (formInput.hasError('pattern')) {
        return 'Invalid IP address.'
      } else if (formInput.hasError('required')) {
        return 'An IP is required';
      }
    }
    if (formInput === this.port) {
      if (formInput.hasError('pattern')) {
        return 'Invalid port number.';
      } else if (formInput.hasError('required')) {
        return 'A port number is required';
      }
    }
  }

  public get isConnected() {
    return this.telemetryService.isConnected;
  }

  private onFrameReceived(frame) {
    this.currentFrame = frame
  }

  ngOnInit() { 
  }
}
