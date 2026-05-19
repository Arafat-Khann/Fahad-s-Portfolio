import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

const DEFAULT_MODEL_URL = '/models/knight.stl';

const COLOR_DEEP = 0x143a5a;
const COLOR_MID = 0x35678c;
const COLOR_BRIGHT = 0x4c7a9e;

const MODEL_HEIGHT = 0.66;
const DRAG_SENSITIVITY = 0.012;
const IDLE_SPIN_SPEED = 0.18;
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
const _spinArm = new THREE.Vector3(0, 0.22, 0.06);
const _spinTangent = new THREE.Vector3();

class KnightSceneController {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      modelUrl: options.modelUrl ?? DEFAULT_MODEL_URL,
      bloomStrength: options.bloomStrength ?? 0.42,
      bloomRadius: options.bloomRadius ?? 0.55,
      dof: options.dof ?? true,
      antialias: options.antialias ?? true,
      powerPreference: options.powerPreference ?? 'high-performance',
      useComposer: options.useComposer !== undefined ? options.useComposer : true,
      ...options,
    };

    this._homeY = 0.42;
    this._isDragging = false;
    this._lastPointerX = 0;
    this._lastPointerY = 0;
    this._userAngle = 0;
    this._idleAngle = 0;
    this._spinScreenDir = new THREE.Vector2(0, 1);
    this._lastFrameTime = performance.now() * 0.001;
    this._elapsedTime = 0;
    this._disposed = false;
    this.knight = null;

    this.scene = createScene();
    this.camera = createCamera();
    this.renderer = createRenderer(canvas, this.options);
    this.material = createMaterial();
    this.lights = setupLights(this.scene);
    this._env = setupEnvironment(this.renderer, this.scene);
    this.composer = this.options.useComposer
      ? setupPostProcessing(this.renderer, this.scene, this.camera, this.options)
      : null;
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
      updateSpinScreenDirection(this);
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
    if (this.composer) this.composer.setSize(width, height);

    const pixelRatio = this.options.pixelRatio;
    this.renderer.setPixelRatio(pixelRatio);
    if (this.composer) this.composer.setPixelRatio(pixelRatio);
    updateSpinScreenDirection(this);
  }

  dispose() {
    this._disposed = true;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('pointerdown', this._onPointerDown);
    window.removeEventListener('pointermove', this._onPointerMove);
    window.removeEventListener('pointerup', this._onPointerUp);
    window.removeEventListener('pointercancel', this._onPointerUp);

    this.knight?.geometry?.dispose();
    this.material.dispose();
    this.material.normalMap?.dispose();
    this.renderer.dispose();
    if (this.composer) this.composer.dispose();
    this._env?.dispose?.();
    this.lights.forEach((light) => light.dispose?.());
  }
}

function createScene() {
  const scene = new THREE.Scene();
  scene.background = null;
  return scene;
}

function createCamera() {
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(1.45, 0.42, 0.05);
  camera.lookAt(0, 0.42, 0);
  return camera;
}

function createRenderer(canvas, options = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: options.antialias !== undefined ? options.antialias : true,
    powerPreference: options.powerPreference ?? 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = true;
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
  mesh.position.y = MODEL_HEIGHT * 0.5;
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

function setupPostProcessing(renderer, scene, camera, options) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(1, 1),
    options.bloomStrength,
    options.bloomRadius,
    0.82,
  );
  composer.addPass(bloom);

  if (options.dof) {
    const bokeh = new BokehPass(scene, camera, {
      focus: 1.55,
      aperture: 0.00022,
      maxblur: 0.002,
      width: 1,
      height: 1,
    });
    composer.addPass(bokeh);
  }

  const chromaticShader = {
    uniforms: {
      tDiffuse: { value: null },
      offset: { value: 0.00022 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D tDiffuse;
      uniform float offset;
      varying vec2 vUv;
      void main() {
        vec2 dir = vUv - 0.5;
        float dist = length(dir);
        vec2 o = normalize(dir) * offset * dist;
        float r = texture2D(tDiffuse, vUv + o).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, vUv - o).b;
        float a = texture2D(tDiffuse, vUv).a;
        gl_FragColor = vec4(r, g, b, a);
      }
    `,
  };
  composer.addPass(new ShaderPass(chromaticShader));

  return composer;
}

function updateSpinScreenDirection(ctx) {
  const rect = ctx.canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  if (!width || !height) {
    return;
  }

  _spinTangent.crossVectors(SPIN_AXIS, _spinArm).normalize();
  _spinTangent.transformDirection(ctx.camera.matrixWorldInverse);

  const pixelDx = _spinTangent.x * width;
  const pixelDy = -_spinTangent.y * height;
  const length = Math.hypot(pixelDx, pixelDy);

  if (length < 1e-5) {
    ctx._spinScreenDir.set(0, 1);
    return;
  }

  ctx._spinScreenDir.set(pixelDx / length, pixelDy / length);
}

function pointerDeltaToSpin(dx, dy, ctx, canvas) {
  const rect = canvas.getBoundingClientRect();
  const scale = DRAG_SENSITIVITY * Math.max(rect.width / 380, 0.75);

  const alongAxis = (dx * ctx._spinScreenDir.x + dy * ctx._spinScreenDir.y) * scale;
  const vertical = dy * scale;

  return alongAxis + vertical;
}

function setupInteraction(ctx) {
  const { canvas } = ctx;

  const onPointerMove = (event) => {
    if (!ctx._isDragging) return;
    event.preventDefault();

    const dx = event.clientX - ctx._lastPointerX;
    const dy = event.clientY - ctx._lastPointerY;
    ctx._lastPointerX = event.clientX;
    ctx._lastPointerY = event.clientY;

    ctx._userAngle += pointerDeltaToSpin(dx, dy, ctx, canvas);
  };

  const endDrag = (event) => {
    if (!ctx._isDragging) return;
    ctx._isDragging = false;
    ctx._idleAngle += ctx._userAngle;
    ctx._userAngle = 0;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
    if (canvas.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    canvas.style.cursor = 'grab';
  };

  ctx._onPointerDown = (event) => {
    if (event.button !== 0) return;
    ctx._isDragging = true;
    updateSpinScreenDirection(ctx);
    ctx._lastPointerX = event.clientX;
    ctx._lastPointerY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    canvas.style.cursor = 'grabbing';
  };

  ctx._onPointerUp = endDrag;
  ctx._onPointerMove = onPointerMove;

  canvas.addEventListener('pointerdown', ctx._onPointerDown);
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';
}

function animationLoop(ctx) {
  if (ctx._disposed) return;
  ctx._raf = requestAnimationFrame(() => animationLoop(ctx));

  if (!ctx.knight) return;

  const now = performance.now() * 0.001;
  const deltaTime = Math.min(now - ctx._lastFrameTime, 0.05);
  ctx._lastFrameTime = now;
  ctx._elapsedTime += deltaTime;
  const elapsedTime = ctx._elapsedTime;

  updateMotion(ctx, elapsedTime, deltaTime);
  ctx.renderer.render(ctx.scene, ctx.camera);
}

function updateMotion(ctx, elapsedTime, deltaTime) {
  const { knight } = ctx;

  const floatY = ctx._isDragging ? 0 : Math.sin(elapsedTime * FLOAT_SPEED) * FLOAT_AMP;
  knight.position.set(0, ctx._homeY + floatY, 0);

  if (!ctx._isDragging) {
    ctx._idleAngle += deltaTime * IDLE_SPIN_SPEED;
  }

  const totalAngle = ctx._idleAngle + ctx._userAngle;
  _spinQuat.setFromAxisAngle(SPIN_AXIS, totalAngle);
  _finalQuat.copy(_spinQuat).multiply(HOME_QUAT);
  knight.quaternion.copy(_finalQuat);
}

export default function KnightScene() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(max-width: 639px)');
    const onChange = () => setIsMobile(mq?.matches ?? false);
    if (mq) {
      onChange();
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else mq.addListener(onChange);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange);
        else mq.removeListener(onChange);
      };
    }

    setIsMobile(window.innerWidth <= 639);
    return undefined;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const mobileOptions = {
      pixelRatio: Math.min(window.devicePixelRatio, 1),
      bloomStrength: 0.12,
      bloomRadius: 0.25,
      dof: false,
      antialias: false,
      powerPreference: 'low-power',
      useComposer: false,
    };

    const options = isMobile ? mobileOptions : undefined;
    const controller = new KnightSceneController(canvas, options);
    return () => controller.dispose();
  }, [isMobile]);

  // Always render the canvas. On mobile we initialize the controller with
  // lower-cost options so the model still appears but with reduced quality
  // and no expensive post-processing.
  return <canvas ref={canvasRef} className="knight-scene-canvas" />;
}