import * as THREE from 'three'
import * as TWEEN  from '@tweenjs/tween.js'
import Control from './components/controls/control'
import { InteractionManager } from "three.interactive";
import Diary from './components/UI/Diary'
import DataViz from './DataViz'
import dataProcessing from './components/dataVizScene/dataProcessing'

import scene_0 from './scene_0';




/*------------------------------ SET UP THREE ENVIRONMENT-------------------------------*/
/*----------------------------------- SCENE 01 --------------------------------------*/

//set up renderer

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('black', 1);
//renderer.setScissorTest( true );
document.body.appendChild(renderer.domElement);

//set up scene & camera

const scene = new THREE.Scene();
let bgColor = new THREE.Color(0x0B0C24);
scene.background = bgColor;
scene.fog = new THREE.Fog(bgColor, 1., 25.);
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 5;
camera.position.y = 1;



/*---------------------------------------WINDOW RESIZE---------------------------------------*/
/*--------------------------------------------------------------------------------------------*/

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);



let scene0 = scene_0();

/*---------------------------------------ADD WRITING COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/

// Get coresponding colors from text input based on a defined rule (emotion wheel)
// function getEmotionColors(input,rule) {
//     let emotions = input.split(', ');
//     let colors = [];
//     emotions.forEach(emo => {
//         let color = rule.find(item => {
//             return item.emotion == emo;
//         }).color;
//         colors.push(color);
//     });
//     return colors;
// }

// function updateEmotionColor(input,rule) {
//     let colors = [...getEmotionColors(input,rule)];
//     let num = colors.length;

//     scene0.Mat_human.uniforms.u_colors.value.splice(0, num, ...colors);
//     scene0.Mat_human.uniforms.u_colorNum.value = num;
// }

// bind callback function (realtime animation)
let diary = new Diary({
    parentWrapper: document.querySelector(".writingContainer"),
    submitBtn: document.querySelector(".submitButton"),
    inputBox: document.querySelector(".textarea"),
    event_afterWritingEmotions: scene0.updateEmotionColor,
    event_afterWritingThought:scene0.generateBubble,
    event_afterNaming:scene0.generateEmotionBall
});

/*---------------------------------------FETCH DATA -----------------------------------------*/
/*--------------------------------------------------------------------------------------------*/



/*---------------------------------------ADD EVENT LISTENERS----------------------------------*/
/*--------------------------------------------------------------------------------------------*/





/*---------------------------------------ADD 3DDATAVIZ COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let dataViz = new DataViz();
const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
  );

let _processedData = dataProcessing( // :array of mesh
    dataViz,
    scene,
    camera,
    interactionManager,
);

/*-----------------------------------SET UP CONTROL & HELPER----------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let control = new Control();
control.farest = -_processedData.length * dataViz.rowSpace;

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
//const controls = new OrbitControls(camera, renderer.domElement);






/*---------------------------------------ANIMATE & RENDER------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let start_time = Date.now();
const animate = function () {
  requestAnimationFrame(animate);
  control.update(camera);
  renderer.render(scene0.scene, scene0.camera);
 // renderer.render(scene, camera);
  interactionManager.update();
  TWEEN.update();

  scene0.update();

  //update uniforms
  _processedData.forEach(item=>{
      item.update();
  //  item.material.uniforms.u_time.value = item.randomValue+(Date.now() - start_time) * .001;
  });

};
animate();

