import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { TelemetryService, Telemetry } from '../telemetry.service'
import { WebsocketService } from '../websocket.service';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror'
import { DebugService } from '../debug.service';
import { Observable, interval, Subject } from 'rxjs'
import 'rxjs/operators';
import { switchMap, tap, take } from 'rxjs/operators';

@Component({
  selector: 'app-telemetry',
  templateUrl: './telemetry.component.html',
  styleUrls: ['./telemetry.component.css'],
})
export class TelemetryComponent implements OnInit {
  @ViewChild('raw') raw: CodemirrorComponent;
  @Input() maxBufferLength: number = 100;
  private prevBufferLength

  private buffer: Array<Telemetry> = new Array();
  private currentFrame: Telemetry;
  private bufferedTime: number;


  constructor(telemetryService: TelemetryService) {
    // telemetryService.messages.subscribe(msg => {
    //   if (this.buffer.length >= this.maxBufferLength) {
    //     this.buffer.shift();
    //   }
    //   this.buffer.push(msg);
    //   this.bufferedTime = (this.buffer.length / this.maxBufferLength) * 100;
    // });

    interval(100)
      .pipe(switchMap(i => {
        this.currentFrame = this.buffer.shift();
        const nextFrame = this.buffer[0];

        const dx = (this.currentFrame && nextFrame && this.currentFrame.dt(nextFrame)) || 500;

        this.bufferedTime = (this.buffer.length / this.maxBufferLength) * 100;
        return interval(dx);
      }))
    .subscribe();
  }

  ngOnInit() { }
}
