import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { WebsocketService } from "./websocket.service";
import { map } from 'rxjs/operators';

const DEBUG_URL = "ws://echo.websocket.org/";

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
  public messages: Subject<Telemetry>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Telemetry>>wsService.connect(DEBUG_URL).pipe(map(
      (response: MessageEvent): Telemetry => {
        let data;
        try {
          data = JSON.parse(response.data);
        } catch {
          console.error("Invalid telemetry recieved!")
        }

        return Object.assign(new Telemetry(), data);;
      }
    ));
  }

  public static InvalidTelemetry: Telemetry = {
    timestamp: -1,
    robot: { x: -1, y: -1 }
  }
}
