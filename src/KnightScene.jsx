import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const DEFAULT_MODEL_URL = '/models/knight.stl';

const COLOR_DEEP = 0x143a5a;
const COLOR_MID = 0x35678c;
const COLOR_BRIGHT = 0x4c7a9e;

const MODEL_HEIGHT = 0.58;
const DRAG_SENSITIVITY = 0.009;
const USER_RETURN_SPEED = 5.5;
const IDLE_SPIN_SPEED = 0.18;
const SETTLED_THRESHOLD = 0.02;
const FLOAT_AMP = 0.012;
const FLOAT_SPEED = 0.55;

const SPIN_AXIS = new THREE.Vector3(0.16, 1, 0.09).normalize();

const HOME_QUAT = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(
    THREE.MathUtils.degToRad(-7),
    THREE.MathUtils.degToRad(14),
    THREE.MathUtils.degToRad(5),
    'YXZ',
  ),
);

const _spinQuat = new THREE.Quaternion();
const _finalQuat = new THREE.Quaternion();

function normalizeAngle(angle) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function lerpAngle(current, target, t) {
  const delta = normalizeAngle(target - current);
  return current + delta * t;
}

class KnightSceneController {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      modelUrl: options.modelUrl ?? DEFAULT_MODEL_URL,
      bloomStrength: options.bloomStrength ?? 0.42,
      bloomRadius: options.bloomRadius ?? 0.55,
      dof: options.dof ?? true,
      ...options,
    };

    this._homeY = 0.35;
    this._isDragging = false;
    this._lastPointerX = 0;
    this._userAngle = 0;
    this._userTargetAngle = 0;
    this._idleAngle = 0;
    this._clock = new THREE.Clock();
    this._disposed = false;
    this.knight = null;

    this.scene = createScene();
    this.camera = createCamera();
    this.renderer = createRenderer(canvas);
    this.material = createMaterial();
    this.lights = setupLights(this.scene);
    this._env = setupEnvironment(this.renderer, this.scene);
    setupInteraction(this);

    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this.resize();

    this._bootstrap();
  }

  async _bootstrap() {
    try {
      this.knight = await createKnightModel(this.options.modelUrl);
      if (this._disposed) {
        this.knight.geometry.dispose();
        return;
      }

      this.knight.material = this.material;
      this.scene.add(this.knight);
      this._raf = requestAnimationFrame(() => animationLoop(this));
    } catch (error) {
      console.error('KnightScene: failed to load knight model', error);
    }
  }

  resize() {
    const width = this.canvas.clientWidth || this.canvas.width;
    const height = this.canvas.clientHeight || this.canvas.height;

    if (width === 0 || height === 0) {
      return;
    }

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(this.options.pixelRatio);
  }

  dispose() {
    this._disposed = true;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    this.canvas.removeEventListener('pointermove', this._onPointerMove);
    this.canvas.removeEventListener('pointerup', this._onPointerUp);
    this.canvas.removeEventListener('pointercancel', this._onPointerUp);

    this.knight?.geometry?.dispose();
    this.material.dispose();
  }
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = null;
  return scene;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(1.38, 0.42, 0.22);
  camera.lookAt(0, 0.42, 0);
  return camera;
}

function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = false;
  return renderer;
}

async function createKnightModel(url = DEFAULT_MODEL_URL) {
  const geometry = await new STLLoader().loadAsync(url);
  geometry.computeVertexNormals();

  geometry.center();
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const scale = MODEL_HEIGHT / size.y;
  geometry.scale(scale, scale, scale);
  geometry.center();
  geometry.computeBoundingBox();

  geometry.rotateY(-Math.PI * 0.5);
  geometry.rotateX(THREE.MathUtils.degToRad(-4));
  geometry.computeVertexNormals();

  const mesh = new THREE.Mesh(geometry);
  mesh.position.y = MODEL_HEIGHT * 0.72;
  return mesh;
}

function createFrostNormalMap() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);

  for (let index = 0; index < size * size; index += 1) {
    const grain = 118 + Math.random() * 36;
    const stride = index * 4;
    data[stride] = grain;
    data[stride + 1] = grain;
    data[stride + 2] = 255;
    data[stride + 3] = 255;
  }

  const map = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 6);
  map.needsUpdate = true;
  return map;
}

function createMaterial() {
  const normalMap = createFrostNormalMap();
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(COLOR_MID),
    metalness: 0,
    roughness: 0.22,
    transmission: 0.96,
    thickness: 2.2,
    ior: 1.5,
    transparent: true,
    opacity: 1,
    attenuationColor: new THREE.Color(COLOR_DEEP),
    attenuationDistance: 0.82,
    clearcoat: 0.5,
    clearcoatRoughness: 0.12,
    specularIntensity: 0.9,
    specularColor: new THREE.Color(COLOR_BRIGHT),
    envMapIntensity: 1.65,
    emissive: new THREE.Color(COLOR_BRIGHT),
    emissiveIntensity: 0.065,
    sheen: 0.35,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color(COLOR_MID),
    normalMap,
    normalScale: new THREE.Vector2(0.12, 0.12),
    side: THREE.DoubleSide,
    depthWrite: false,
  });
}

function setupLights(scene) {
  const lights = [];

  const key = new THREE.DirectionalLight(0xb8d4e8, 2.1);
  key.position.set(2.5, 4.5, 3.8);
  scene.add(key);
  lights.push(key);

  const rim = new THREE.DirectionalLight(COLOR_BRIGHT, 3.2);
  rim.position.set(-4.5, 2.2, -2.8);
  scene.add(rim);
  lights.push(rim);

  const rimBack = new THREE.DirectionalLight(0x6a9ab8, 1.5);
  rimBack.position.set(0.2, 1.8, -5.5);
  scene.add(rimBack);
  lights.push(rimBack);

  const fill = new THREE.HemisphereLight(COLOR_BRIGHT, COLOR_DEEP, 0.3);
  scene.add(fill);
  lights.push(fill);

  const soft = new THREE.AmbientLight(COLOR_MID, 0.07);
  scene.add(soft);
  lights.push(soft);

  return lights;
}

function setupEnvironment(renderer, scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const environment = new RoomEnvironment();
  const envMap = pmrem.fromScene(environment, 0.04).texture;
  scene.environment = envMap;
  environment.dispose();
  pmrem.dispose();
  return envMap;
}

function setupInteraction(ctx) {
  const { canvas } = ctx;

  ctx._onPointerDown = (event) => {
    if (event.button !== 0) return;
    ctx._isDragging = true;
    ctx._lastPointerX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = 'grabbing';
  };

  ctx._onPointerMove = (event) => {
    if (!ctx._isDragging) return;

    const deltaX = event.clientX - ctx._lastPointerX;
    ctx._lastPointerX = event.clientX;
    ctx._userAngle += deltaX * DRAG_SENSITIVITY;
    ctx._userTargetAngle = ctx._userAngle;
  };

  ctx._onPointerUp = (event) => {
    if (!ctx._isDragging) return;
    ctx._isDragging = false;
    ctx._userAngle = normalizeAngle(ctx._userAngle);
    ctx._userTargetAngle = 0;
    canvas.releasePointerCapture(event.pointerId);
    canvas.style.cursor = 'grab';
  };

  canvas.addEventListener('pointerdown', ctx._onPointerDown);
  canvas.addEventListener('pointermove', ctx._onPointerMove);
  canvas.addEventListener('pointerup', ctx._onPointerUp);
  canvas.addEventListener('pointercancel', ctx._onPointerUp);
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';
}

function animationLoop(ctx) {
  if (ctx._disposed) return;
  ctx._raf = requestAnimationFrame(() => animationLoop(ctx));

  if (!ctx.knight) return;

  const deltaTime = Math.min(ctx._clock.getDelta(), 0.05);
  const elapsedTime = ctx._clock.elapsedTime;

  updateMotion(ctx, elapsedTime, deltaTime);
  ctx.renderer.render(ctx.scene, ctx.camera);
}

function updateMotion(ctx, elapsedTime, deltaTime) {
  const { knight } = ctx;

  const floatY = ctx._isDragging ? 0 : Math.sin(elapsedTime * FLOAT_SPEED) * FLOAT_AMP;
  knight.position.set(0, ctx._homeY + floatY, 0);

  if (!ctx._isDragging) {
    const returnFactor = 1 - Math.exp(-USER_RETURN_SPEED * deltaTime);
    ctx._userAngle = lerpAngle(ctx._userAngle, ctx._userTargetAngle, returnFactor);
  }

  const settled =
    !ctx._isDragging &&
    Math.abs(ctx._userAngle) < SETTLED_THRESHOLD &&
    Math.abs(ctx._userTargetAngle) < SETTLED_THRESHOLD;

  if (settled) {
    ctx._idleAngle += deltaTime * IDLE_SPIN_SPEED;
  }

  const totalAngle = ctx._idleAngle + ctx._userAngle;
  _spinQuat.setFromAxisAngle(SPIN_AXIS, totalAngle);
  _finalQuat.copy(_spinQuat).multiply(HOME_QUAT);
  knight.quaternion.copy(_finalQuat);
}

export default function KnightScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const controller = new KnightSceneController(canvas);

    return () => {
      controller.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="knight-scene-canvas" />;
}