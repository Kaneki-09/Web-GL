import 'the-new-css-reset/css/reset.css';
import './style.css';
import * as THREE from "three";
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

//GSAP
gsap.registerPlugin(ScrollTrigger, ScrollSmoother,SplitText);

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//シーン
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

//カメラ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.z = 8;
scene.add(camera);

//周囲光
const light = new THREE.AmbientLight(0xffffff,10);
scene.add(light);

//軸ヘルパー
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

const group = new THREE.Group();
        scene.add(group);

let material = null;
let textGeometry = null;

const getText = (font) => {
  let text = "TRIDENT WEBDESIGN CONFERENCE 2025";

  material = new THREE.MeshStandardMaterial({ color: 0x000000 });
  textGeometry = new TextGeometry(text, {
    font: font,
    size: 0.4,
    color: 0xf0f0f0,
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 3,
  });

  textGeometry.center();

  text = new THREE.Mesh(textGeometry, material);
  group.add(text);
  gsap.from(text.scale, {
    x: 0,
    y: 0,
    z: 0,
    duration: 1.5,
    ease: "back.out(1.7)"
  });

  gsap.to(group.position, {
    y: 0.3,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  gsap.timeline({
    scrollSmoother: {
      smooth: 1,
      effects: true,
      normalizeScroll: true,
    },
    scrollTrigger: {
      trigger: '#concept',
      start: "center top",
      end: "bottom center",
      toggleActions: "play none none reverse",
      scrubs: true,
      markers: true,
    }
  })
    .to(text.position, { z: -10 });
};

const fontLoader = new FontLoader();
fontLoader.load('/font/Eagle Lake_Regular.json', (font) => {
    console.log(font);
    getText(font);
})

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

//更新
const update = () => {
  stats.begin();
  renderer.render(scene, camera);
  stats.end();
  window.requestAnimationFrame(update);
};

update();

//ウィンドウリサイズ
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});