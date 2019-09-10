import { Component, OnInit, Input } from '@angular/core';
import { TelemetryService } from '../telemetry.service';
import { Object3D } from 'three';
import { Subject, timer } from 'rxjs';
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
  constructor(private telemetryService: TelemetryService) {

  }

  ngOnInit() {
    this.initializeRobotModel();

    let t = timer(0,100);
    t.subscribe(t => {
      this.update();
    });
  }

  private update() {
    let that = this;
    if (!that.telemetryService.currentFrame) {
      return;
    }

    let robot = that.telemetryService.currentFrame.robot;
    if (!robot){
      return;
    }

    const x = (robot.x || that.proxiedObject.position.x || 0) as number;
    const y = (robot.y || that.proxiedObject.position.y || 0) as number;
    const z = (robot.z || that.proxiedObject.position.z || 0) as number;

    that.proxiedObject.position.setX(x);
    that.proxiedObject.position.setY(y);
    that.proxiedObject.position.setZ(z);

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
