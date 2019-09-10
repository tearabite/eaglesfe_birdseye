import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Object3D } from 'three';
import { GameProviderService, Game } from '../gameprovider.service';
import { ThreeHelpers } from '../util/threehelpers';
import { RobotComponent } from '../robot/robot.component';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css'],
})
export class SceneComponent implements AfterViewInit {
  @Input() lightColor: string | number | THREE.Color = '#444444';
  @Input() shadowsEnabled: boolean = true;
  @Input() antialiasEnabled: boolean = true;

  @ViewChild('canvas') canvasRef: ElementRef
  @ViewChild(RobotComponent) robot: RobotComponent;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: OrbitControls;
  private gameModelIds: Array<number>;
  private robotModelId: number;
  private fieldRotationVector = new THREE.Vector3(THREE.Math.degToRad(90), THREE.Math.degToRad(-90), 0);

  constructor(private gameProvider: GameProviderService) {
    gameProvider.current.subscribe(async (game: Game) => {
      // If we already have game models, remove each of them from the scene first.
      if (this.gameModelIds) {
        this.gameModelIds.forEach(id => {
          const model = this.scene.getObjectById(id);
          this.scene.remove(model);
        })
      }

      this.gameModelIds = [];

      // Load the new models.
      const models = await gameProvider.getAssetsForGame(game);
      models.forEach(model => {
        this.scene.add(model);
        this.gameModelIds.push(model.id);
      });
    });
  }

  async ngAfterViewInit() {
    this.initializeRenderer();
    this.initializeCamera();
    await this.initializeScene();
    this.initializeControls();

    this.robot.model.subscribe((model) => {
      this.scene.add(model);
    });

    this.startRenderingLoop();
  }

  private startRenderingLoop() {
    let component: SceneComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.renderer.render(component.scene, component.camera);
    }());
  }

  initializeRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: this.antialiasEnabled });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.gammaOutput = true;
    if (this.shadowsEnabled) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }

  initializeCamera() {
    this.camera = new THREE.PerspectiveCamera(
      /*fov*/ 75,
      /*aspectRatio*/ this.aspectRatio,
      /*near*/ 0.1,
      /*far*/ 1000);

    this.camera.up = new THREE.Vector3(0, 0, 1);
    this.camera.setViewOffset(this.canvas.clientWidth * .75, this.canvas.clientHeight, 0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.camera.position.set(0, 0, 135);
  }

  async initializeScene() {
    this.scene = new THREE.Scene();
    let light = new THREE.DirectionalLight(this.lightColor, 1);
    let ambient = new THREE.AmbientLight(this.lightColor);
    let spotlight = new THREE.SpotLight(this.lightColor);

    spotlight.position.set(0, 0, 80);
    spotlight.castShadow = true;
    spotlight.penumbra = 0.06;
    spotlight.intensity = 1.5;
    light.position.set(0, -70, 100).normalize();

    this.scene.add(light);
    this.scene.add(ambient);
    this.scene.add(spotlight);

    this.addFieldModel();
  }

  initializeControls() {
    this.controls = new OrbitControls( this.camera );
    this.controls.maxPolarAngle = THREE.Math.degToRad(80);
    this.controls.minPolarAngle = THREE.Math.degToRad(0);
    this.controls.update();
  }

  public onResize() {
    this.camera.aspect = this.aspectRatio;
    this.camera.setViewOffset(window.innerWidth * .75, window.innerHeight, 0, 0, window.innerWidth, window.innerHeight);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private get aspectRatio(): number {
    return this.canvas.clientHeight / this.canvas.clientHeight;
  }
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private async addFieldModel() {
    const field = await ThreeHelpers.loadModel(ThreeHelpers.Models.ftc.field)

    field.traverse(child => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
    field.rotation.setFromVector3(this.fieldRotationVector);
    field.up = ThreeHelpers.zAxis;
    this.scene.add(field);
  }
}
