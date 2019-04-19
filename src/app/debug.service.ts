import { Injectable, Input } from '@angular/core';
import {TelemetryService, Telemetry} from './telemetry.service';
import { Observable, interval, Subscription, timer, of} from 'rxjs';
import { switchMap, tap, map, repeat, take } from 'rxjs/operators';
import { GameProviderService as GameProviderService } from './gameprovider.service';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  @Input() dt: number = 50;
  private sub : Subscription;

  constructor(private telemetryService: TelemetryService) {
  }

  startSimulating() {
    this.sub = this.broadcast$.subscribe(t => {
      this.telemetryService.messages.next(DebugService.generateRandomTelemetry());
    });
  }

  stopSimulating() {
    this.sub.unsubscribe();
  }

  broadcast$ = of(null)
    .pipe(switchMap(() => {
      let newDt = this.dt;
      let jitter = Math.floor(Math.random() * (newDt * 0.1 + 1) - (newDt * 0.1))
      newDt = newDt + jitter;
      return timer(newDt)
    })) // wait for interval, then emit
    .pipe(map(() => DebugService.generateRandomTelemetry())) // get new time
    .pipe(repeat()); // start over

  static generateRandomTelemetry(): Telemetry {
    return {
      timestamp: new Date().getTime(),
      robot: {
        x: Math.floor(Math.random() * 144 + 1) - 72,
        y: Math.floor(Math.random() * 144 + 1) - 72,
        z: Math.floor(Math.random() * 144 + 1) - 72,
        pitch: Math.floor(Math.random() * 360 + 1) - 180,
        roll: Math.floor(Math.random() * 360 + 1) - 180,
        heading: Math.floor(Math.random() * 360 + 1) - 180,
      }
    }
  }
}
