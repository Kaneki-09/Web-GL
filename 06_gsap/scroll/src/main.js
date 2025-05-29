import './style.css';
import * as THREE from "three";
import GUI from 'lil-gui';
import Stats from 'stats-js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

console.log(gsap);

//UIデバッグ
const gui = new GUI();

//FPSデバッグ
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

//シーン
const scene = new THREE.Scene();

//カメラ
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.z = 5;
scene.add(camera);

//軸ヘルパー
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//レンダラー
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

//周囲光
const light = new THREE.AmbientLight(0xffffff, 5);
scene.add(light);

//オブジェクト
const mtlLoader = new MTLLoader();
mtlLoader.load('models/Panda/Panda.mtl', (materials) => {
  materials.preload();

  const objLoader = new OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load('models/Panda/Panda.obj', (obj) => {
    scene.add(obj);
    obj.scale.set(0.2, 0.2, 0.2);
    gsap.timeline({
      scrollTrigger: {
        trigger: '#trigger01',
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
        scrubs: true,
        markers: true,
      }
    })
      .to(obj.position, { z: 5 })
      .to(obj.rotation, { z: 3 });

    gsap.timeline({
      scrollTrigger: {
        trigger: '#trigger02',
        start: "top center",
        end: "bottom center",
        toggleActions: "play none none reverse",
        // scrubs: true,
        markers: true,
      }
    })
    .to(obj.position, { z: 0 })
      .to(obj.rotation, { z: Math.PI *2 })

      gsap.timeline({
        scrollTrigger: {
          trigger: '#trigger03',
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
          // scrubs: true,
          markers:true,
        }
      })
  });
});


// gsap.timeline({
//   repeat: -1,
//   repeatDelay: 1,
//   yoyo: true,
// })
//   .to(obj.rotation, {
//     x: Math.PI * 2,
//     duration:1,
//   })
//   .to(obj.position, {
//     x: "+=2",
//     duration:1,
//   }, "<")
//   .to(obj.rotation, {
//     y: Math.PI * 2,
//     duration:1,
//   })
//   .to(obj.rotation, {
//     z: Math.PI*2,
//     duration:1,
//   });

// gsap.fromTo(obj.position, {
//   x: -2,
//   y: -2,
//   z: -2,
// },{
//   x: 2,
//   y: 2,
//   z:2,
//   duration: 2,
//   delay: 1,
//   repeat: -1,
//   repeatDelay: 1,
//   yoyo:true,
//   ease: 'power4.inOut',
// });

// gsap.to(obj.rotation, {
//   x: Math.PI/180 * 2,
//   y: Math.PI * 3,
//   z:Math.PI * 4,
//   duration:2,
//   repeat: -1,
//   repeatDelay: 1,
//   ease: 'power4.inOut',
// });

// gsap.to(obj.scale, {
//   x: 2,
// });

//GUI
// gui.add(obj.rotation, 'x', 0, Math.PI * 2, 0.01).name('X軸回転');
// gui.add(obj.rotation, 'y', 0, Math.PI * 2, 0.01).name('Y軸回転');
// gui.add(obj.rotation, 'z', 0, Math.PI * 2, 0.01).name('Z軸回転');

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