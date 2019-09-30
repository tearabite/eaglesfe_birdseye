import { Component, OnInit } from '@angular/core';
import { Telemetry, TelemetryService } from '../telemetry.service';
import { FirebaseService } from '../firebase.service';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  private currentFrame: Telemetry;
  public allFrames: Telemetry[] = [];
  private recording: boolean = false;

  constructor(private telemetryService: TelemetryService, private firebaseService: FirebaseService) {
  }

  ngOnInit() {
  }

  onSend() {
    this.firebaseService.addTelemetry(this.allFrames);
  }

  onRecord() {
    this.recording = !this.recording;
    if (this.recording) {
      this.telemetryService.messages.subscribe(m => this.allFrames.push(m));
    } else {
      this.telemetryService.messages.unsubscribe();
    }

  }

}
