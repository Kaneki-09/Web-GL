import './style.css';
import * as THREE from "three";
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

// UIデバッグ
const gui = new GUI();

// FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

// シーン
const scene = new THREE.Scene();

// カメラ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.z = 5;
scene.add(camera);

const loader = new THREE.CubeTextureLoader();
const environmentMap = loader.load([
  'textures/cube/posx.jpg', // 右面
  'textures/cube/negx.jpg', // 左面
  'textures/cube/posy.jpg', // 上面
  'textures/cube/negy.jpg', // 下面
  'textures/cube/posz.jpg', // 前面
  'textures/cube/negz.jpg', // 背面
]);

scene.background = environmentMap;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({
    metalness: 1,
    roughness: 0,
    envMap: environmentMap,
  })
);
scene.add(sphere);

const materialFolder = gui.addFolder('Meterial Settings');
materialFolder.add(sphere.material, 'metalness', 0, 1, 0.01);
materialFolder.add(sphere.material, 'roughness', 0, 1, 0.01);

// 周囲光
const light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

// 軸ヘルパー
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

// コントロール
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


const draggableObjects = [sphere];
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

dragControls.addEventListener('dragstart', () => controls.enabled = false);
dragControls.addEventListener('dragend', () => controls.enabled = true);

for (let i = 0; i < 100; i++){
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshStandardMaterial({
      metalness: 1,
      roughness: 0,
      envMap: environmentMap,
    })
  );
  box.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 5,
    (Math.random() - 0.5) * 10
  );
  scene.add(box);
  draggableObjects.push(box);
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  intersects.forEach((intersect) => {
    if (intersect.object.isMesh) {
      intersect.object.material.color.set(0xff0000);
    }
  })
});

// 更新
const update = () => {
  stats.begin();
  renderer.render(scene, camera);
  controls.update();
  stats.end();
  window.requestAnimationFrame(update);
};

update();

// ウィンドウリサイズ
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});