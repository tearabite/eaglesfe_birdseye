import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three'
import { ThreeHelpers } from './scene.helpers'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef: ElementRef
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private controls: OrbitControls;

  constructor() { }

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
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
    let light = new THREE.DirectionalLight("#444444", 1);
    let ambient = new THREE.AmbientLight("#444444");
    let spotlight = new THREE.SpotLight("#444444");

    spotlight.position.set(0, 0, 80);
    spotlight.castShadow = true;
    spotlight.penumbra = 0.06;
    spotlight.intensity = 1.5;
    light.position.set(0, -70, 100).normalize();

    // Add lights
    this.scene.add(light);
    this.scene.add(ambient);
    this.scene.add(spotlight);

    ThreeHelpers.addModelToScene(this, ThreeHelpers.models_FieldPath);
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
}
