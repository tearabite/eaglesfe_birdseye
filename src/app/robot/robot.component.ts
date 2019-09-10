import { Component, OnInit, Input } from '@angular/core';
import { TelemetryService } from '../telemetry.service';
import { Object3D } from 'three';
import { Subject } from 'rxjs';
import { ThreeHelpers } from '../util/threehelpers';
import * as THREE from 'three';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.css'],
})
export class RobotComponent implements OnInit {
  private proxiedObject: Object3D;
  public model = new Subject<Object3D>();
  constructor(telemetryService: TelemetryService) {
    const that = this;

    telemetryService.messages.subscribe(msg => {
      let robot = msg.robot;
      if (!robot){
        return;
      }

      const x = (msg.robot.x || that.proxiedObject.position.x || 0) as number;
      const y = (msg.robot.y || that.proxiedObject.position.y || 0) as number;
      const z = (msg.robot.z || that.proxiedObject.position.z || 0) as number;

      that.proxiedObject.position.setX(x);
      that.proxiedObject.position.setY(y);
      that.proxiedObject.position.setZ(z);
    });

    this.initializeRobotModel();
  }

  ngOnInit() {

  }

  private async initializeRobotModel() {
    let robot = await ThreeHelpers.loadModel(ThreeHelpers.Models.ftc.curiosity_rover);
    robot.rotateOnAxis(ThreeHelpers.xAxis, THREE.Math.degToRad(90));
    robot.castShadow = true;
    robot.receiveShadow = true
    this.proxiedObject = robot;
    this.model.next(this.proxiedObject);
  }
}
