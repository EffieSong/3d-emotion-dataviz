import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Control from './components/controls/control'
import {
    InteractionManager
} from "three.interactive";
import Diary from './components/UI/Diary'
import DataViz from './DataViz'
import dataProcessing from './components/dataVizScene/dataProcessing'

import scene_0 from './scene_0';
import EmotiveGenerator from './components/EmotiveGenerator';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';

import Transition from './components/Transition';

import 'regenerator-runtime/runtime';

//import { MongoClient } from 'mongodb'
//const MongoClient = require('mongodb').MongoClient;

//console.log(require('mongodb'))

/*------------------------------ SET UP THREE ENVIRONMENT-------------------------------*/
/*----------------------------------- SCENE 01 --------------------------------------*/

//set up renderer

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('black', 1);
document.body.appendChild(renderer.domElement);


/*---------------------------------------SET UP SCENES---------------------------------*/
/*--------------------------------------------------------------------------------------------*/


let scene0 = scene_0();
let scene1 = scene_1();

function onWindowResize() {
    scene0.onWindowResize();
    scene1.onWindowResize();
    renderer.setSize(window.innerWidth, window.innerHeight);

}
window.addEventListener('resize', onWindowResize, false);

function scene_1() {
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


    let control = new Control();
    control.farest = -_processedData.length * dataViz.rowSpace;

    function update() {
        interactionManager.update();
        control.update(camera);
        //update uniforms
        _processedData.forEach(item => {
            item.update();
            //  item.material.uniforms.u_time.value = item.randomValue+(Date.now() - start_time) * .001;
        });
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /*-----------------------------------SET UP CONTROL & HELPER----------------------------------*/
    /*--------------------------------------------------------------------------------------------*/


    // const gridHelper = new THREE.GridHelper(10, 10);
    // scene.add(gridHelper);
    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    //const controls = new OrbitControls(camera, renderer.domElement);


    return {
        scene,
        camera,
        interactionManager,
        update,
        onWindowResize
    }
}


/*---------------------------------------ADD WRITING COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/

let diary = new Diary({
    parentWrapper: document.querySelector(".writingContainer"),
    submitBtn: document.querySelector(".submitButton"),
    inputBox: document.querySelector(".textarea"),
    event_afterWritingEmotions: scene0.updateEmotionColor,
    event_afterWritingThought: scene0.generateBubble,
    event_afterNaming:scene0.generateEmotionBall
});


// Intrface of writing diary disappear. Current scene is switched to the scene of data archive.

function writingUIDisappear(){
    let diaryArea = document.querySelector(".writingContainer");
    diaryArea.style.display = "none";
}





/*----------------------------------SCENE TRANSITION----------------------------------*/
/*--------------------------------------------------------------------------------------------*/

// Manage scene transition effect

let transition = new Transition(renderer, scene0, scene1);

/*---------------------------------------ANIMATE & RENDER------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let start_time = Date.now();
let pre_writingIsDone = false;

const animate = function () {
    requestAnimationFrame(animate);

    // Check writing status

    let writingIsDone = diary.getStatus();

    if (writingIsDone && !pre_writingIsDone) {
        transition.startAnimate();
        writingUIDisappear();
    }

    pre_writingIsDone = writingIsDone;


  //  transition.update();
   scene1.update();

  renderer.render(scene1.scene, scene1.camera);

    TWEEN.update();



};
animate();