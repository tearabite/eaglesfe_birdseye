import { Component, OnInit } from '@angular/core';
import { Telemetry, TelemetryService } from '../telemetry.service';
import { FirebaseService } from '../firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css']
})
export class RecorderComponent implements OnInit {

  form: FormGroup;

  private currentFrame: Telemetry;
  public allFrames: Telemetry[] = [];
  private recording: boolean = false;
  public saveName: string = null;

  constructor(private telemetryService: TelemetryService, private firebaseService: FirebaseService, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      recordingName: ['', [
        Validators.required,
        Validators.maxLength(120),
        Validators.pattern
      ]],
    })
  }

  get recordingName() {
    return this.form.get('recordingName');
  }

  onSend() {
    this.firebaseService.addTelemetry(this.allFrames);
  }

  onRecord() {
  }
}
