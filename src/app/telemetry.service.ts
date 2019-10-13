import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { throttleTime } from 'rxjs/operators';

export class Telemetry {
  dt?: (other: Telemetry) => number;

  constructor() {
    this.dt = (other: Telemetry): number => {
      return Math.abs(other.timestamp - this.timestamp);
    }
  }

  timestamp: number;
  robot: { x: Number; y: Number; z?: Number; pitch?: Number; roll?: Number; heading?: Number; battery?: number; };
  controller?: { battery?: Number; };
  targets?: { x: Number; y: Number; z?: Number; relativeTo?: "robot" | "field"; }[];
  other?: any;
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryService {
  private ws: WebSocketSubject<unknown>;
  public static messages: Subject<Telemetry> = new Subject<Telemetry>();;
  public currentFrame: Telemetry;
  private maxMessageRate: number = 10; // Only process 10 frames per second

  constructor() {
    console.log("New instance of telemetry service created");
  }

  public send(object: any) {
    this.ws.next(object);
  }

  public connect(url: string) {
    if (this.isConnected) {
      return;
    }
    this.ws = webSocket(url);
    this.ws.pipe(throttleTime(1000 / this.maxMessageRate)).subscribe(
      (frame) => this.onFrameReceived(frame),
      (error) => this.onConnectionError(error),
      () => this.onConnectionClosed());
  }

  public disconnect() {
    if (this.ws != null) {
      this.ws.complete();
      this.ws = null;
    }
  }

  public get isConnected(): boolean {
    return this.ws != null && this.ws != undefined;
  }

  private onFrameReceived(frame): void {
    if (frame as Telemetry && TelemetryService.messages) {
      TelemetryService.messages.next(frame as Telemetry)
    }
  }

  private onConnectionError(error): void {
    this.ws.complete();
    this.ws = null;
  }

  private onConnectionClosed(): void {
    console.log("disconnected");
  }
}
