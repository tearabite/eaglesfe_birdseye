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
    this.telemetryService.messages.subscribe(msg => this.currentFrame = msg );
  }

  ngOnInit() { 
  }
}
