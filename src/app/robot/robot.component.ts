import { Component, OnInit, Input } from '@angular/core';
import { TelemetryService } from '../telemetry.service';
import { Object3D, Vector3 } from 'three';
import { Subject, timer } from 'rxjs';
import { ThreeHelpers } from '../util/threehelpers';
import * as THREE from 'three';

@Component({
  selector: 'app-robot',
  template: '',
})
export class RobotComponent implements OnInit {
  private proxiedObject: Object3D;
  public model = new Subject<Object3D>();

  constructor(private telemetryService: TelemetryService) {
    TelemetryService.messages.subscribe(msg => this.update(msg), error => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.initializeRobotModel();
  }

  private update(frame) {
    let that = this;
    if (!frame || !frame.robot || !that.proxiedObject) {
      return;
    }
    let robot = frame.robot;

    const x = (robot.x || that.proxiedObject.position.x || 0) as number;
    const y = (robot.y || that.proxiedObject.position.y || 0) as number;
    const z = (robot.z || that.proxiedObject.position.z || 0) as number;
    const pitch = (robot.pitch || that.proxiedObject.rotation.y || 0) as number;
    const roll = (robot.roll || that.proxiedObject.rotation.x || 0) as number;
    const heading = (robot.heading || that.proxiedObject.rotation.z || 0) as number;

    that.proxiedObject.position.setX(x);
    that.proxiedObject.position.setY(y);
    that.proxiedObject.position.setZ(z);
    
    that.proxiedObject.rotation.setFromVector3(new Vector3(
      THREE.Math.degToRad(roll),
      THREE.Math.degToRad(pitch),
      THREE.Math.degToRad(heading)
    ))
  }

  private async initializeRobotModel() {
    let robot = await ThreeHelpers.loadModel(ThreeHelpers.Models.ftc.curiosity_rover);
    robot.rotateOnAxis(ThreeHelpers.xAxis, THREE.Math.degToRad(90));

    robot.updateMatrix();
    robot.children.forEach(c => c.applyMatrix(robot.matrix));
    robot.position.set(0,0,0);
    robot.rotation.set(0,0,0);
    robot.scale.set(1,1,1);
    robot.updateMatrix();
  
    robot.castShadow = true;
    robot.receiveShadow = true
    this.proxiedObject = robot;
    this.model.next(this.proxiedObject);
  }
}
