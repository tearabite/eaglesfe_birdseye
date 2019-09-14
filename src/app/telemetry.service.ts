import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

//const DEBUG_URL = "ws://echo.websocket.org/";
const DEBUG_URL = "ws://localhost:8080";

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
  private ws : WebSocketSubject<unknown>;
  public messages: Subject<Telemetry>;
  public currentFrame: Telemetry;

  constructor() {
    this.messages = new Subject<Telemetry>();
    this.ws = webSocket(DEBUG_URL);
    this.ws.subscribe(
      msg => {
        if (msg as Telemetry) {
          this.messages.next(msg as Telemetry)
        }
      },
      err => console.log(err),
      () => console.log("complete")
    );
  }

  public send (object: any) {
    this.ws.next(object);
  }

  public static InvalidTelemetry: Telemetry = {
    timestamp: -1,
    robot: { x: -1, y: -1 }
  }
}
