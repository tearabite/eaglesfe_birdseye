import { Component, OnInit, Input } from '@angular/core';
import { TelemetryService } from '../telemetry.service';
import { ModelProviderService } from '../modelprovider.service';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.css'],
})
export class RobotComponent implements OnInit  {
  @Input() customModel: string;

  constructor(telemetryService: TelemetryService, private modelProvider: ModelProviderService) {
    telemetryService.messages.subscribe(msg => {
      console.log(msg);
    });

    this.initializeRobotModel();
  }

  ngOnInit() {

  }

  initializeRobotModel() {
    this.modelProvider.loadModel(ModelProviderService.Models.ftc.curiosity_rover);
  }
}
