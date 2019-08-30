import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as THREE from 'three'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ModelProviderService, ThreeHelpers } from '../modelprovider.service';
import { Object3D } from 'three';

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
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: OrbitControls;

  constructor(private modelProvider: ModelProviderService) {
    modelProvider.loading.subscribe((progress: ProgressEvent) => {
      console.log(`Loading Models: ${(progress.loaded/progress.total * 100).toFixed(2)}%`);
    });

    modelProvider.loaded.subscribe((model: Object3D) => {
      this.processModel(model);
      this.scene.add(model);
    });

    modelProvider.loadError.subscribe((error: ErrorEvent) => {

    });

    modelProvider.removed.subscribe(uuid => {
      const child = this.scene.children.filter(c => c.uuid === uuid)[0];
      this.scene.remove(child);
    });
  }

  ngAfterViewInit(): void {
    this.initializeRenderer();
    this.initializeCamera();
    this.initializeScene();
    this.initializeControls();

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

  initializeScene() {
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

    this.modelProvider.loadModel(ModelProviderService.Models.ftc.field)
    this.modelProvider.buildRobot();
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

  public addModel(model: GLTF) {
    this.scene.add(model.scene);
  }

  private get aspectRatio(): number {
    return this.canvas.clientHeight / this.canvas.clientHeight;
  }
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  processModel(model: Object3D) {
    model.traverse(child => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
    model.rotateX(THREE.Math.degToRad(90));
    model.rotateY(THREE.Math.degToRad(-90));
    model.up = ThreeHelpers.zAxis;
  }
}
