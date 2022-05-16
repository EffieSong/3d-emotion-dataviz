import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Control from './components/controls/control'
import {
    InteractionManager
} from "three.interactive";
import Diary from './components/UI/Diary'
import DataViz from './DataViz'

import scene_0 from './scene_0';
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


/*---------------------------------------SCENE_1---------------------------------*/
/*--------------------------------------------------------------------------------------------*/

// dependencies for function scene_1()
import DiaryObj from "./components/diaryData/diaryObj";
import EmotionBall from './components/dataVizScene/EmotionBall';

import {
    FEELINGDATA
} from './components/diaryData/FEELINGDATA'
import buildWorld from './components/dataVizScene/buildWorld'

function scene_1() {


    /*---------------------------------------THREEJS SCENE SET UP---------------------------------*/
    /*--------------------------------------------------------------------------------------------*/

    const scene = new THREE.Scene();
    let bgColor = new THREE.Color(0x17181C);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor, 1., 25.);
    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // camera.position.z = 5;
    // camera.position.y = 10;



    /*----------------------------------BUILD WORLD: CREATE OBJECTS---------------------------------*/
    /*--------------------------------------------------------------------------------------------*/


    let dataViz = new DataViz(); // objects that stores global variables


    // Create lines and tags

    let worldObjects = buildWorld(
        dataViz, // DataViz,
        scene, // THREE.Scene,
        camera,
    );


    // Create timeMesh above the space

    var canvas = document.createElement("canvas");
    let ctx = canvas.getContext('2d');
    let mostCurrentDate = 30;

    function changeCanvas(text) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.font = '30pt Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text+` April, 2022`, canvas.width / 2, canvas.height / 2);
    }

    let texture = new THREE.Texture(canvas);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent:true, 
        opacity:1.0
    });
    let geometry = new THREE.PlaneGeometry(4, 2);
    let timeMesh = new THREE.Mesh(geometry, material);
    timeMesh.position.z = -10;
    scene.add(timeMesh);




    /*--------------------------ADD EVENTLISNTER AND INTERACTION------------------------------*/
    /*--------------------------------------------------------------------------------------------*/


    let mouseWheelY = 0;

    document.addEventListener('mousewheel', event => {

        mouseWheelY += event.wheelDeltaY * 0.001;
        let offset = Math.floor(-(camera.position.z - 5) / dataViz.rowSpace);
        offset = offset < 0 ? 0 : offset;

        let dateString = `${mostCurrentDate - offset}`;
        changeCanvas(dateString);

    }, false);

    // Add interaction manager for three.js objects

    const interactionManager = new InteractionManager(
        renderer,
        camera,
        renderer.domElement
    );


    /*---------------------------------- CREATE BALLS-------------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/

    const diaryObjs = []; // an array of :DiaryObj 

    // Create an object for each diary data

    FEELINGDATA.forEach((diary, index) => {

        let diaryObj = new DiaryObj({
            time: diary.time,
            type: diary.type,
            relatedEvent: diary.relatedEvent,
            emotions: diary.emotions,
            event: diary.event,
            thoughts: diary.thoughts,
            bodyReaction: diary.bodyReaction,
            nameOfFeelings: diary.nameOfFeelings,
        })

        diaryObj.index = index; // add index to each diary object
        diaryObj.eventTypeIndex = dataViz.eventTypes.indexOf(diary.type); // add index of event types, which is used to compute the placement X.

        diaryObjs.push(diaryObj);

    });

    //CREATE BALL FOR EACH DIARYOBJ

    let emotionBalls = [];

    diaryObjs.forEach(item => {

        let emotionBall = new EmotionBall({
            diaryObj: item,
            colSpace: dataViz.colSpace,
            rowSpace: dataViz.rowSpace,
            interactionManager: interactionManager,
            scene: scene,
            camera: camera,
            offsetX: -dataViz.colSpace * (dataViz.bars - 1) / 2 // translate all the balls as a group to place this group at the center
        });

        emotionBalls.push(emotionBall);
        emotionBall.balls = emotionBalls;

    });



    function addball(diary, matUnifroms) {
        let diaryObj = new DiaryObj({
            time: diary.time,
            type: diary.type,
            relatedEvent: diary.relatedEvent,
            emotions: diary.emotions,
            event: diary.event,
            thoughts: diary.thoughts,
            bodyReaction: diary.bodyReaction,
            nameOfFeelings: diary.nameOfFeelings,
        })

        diaryObj.index = 0; // add index to each diary object
        diaryObj.eventTypeIndex = dataViz.eventTypes.indexOf(diary.type); // add index of event types, which is used to compute the placement X.

        diaryObjs.push(diaryObj);

        let emotionBall = new EmotionBall({
            diaryObj: diaryObj,
            colSpace: dataViz.colSpace,
            rowSpace: dataViz.colSpace,
            interactionManager: interactionManager,
            scene: scene,
            camera: camera,
            offsetX: -dataViz.colSpace * (dataViz.bars - 1) / 2 // translate all the balls as a group to place this group at the center
        });

        emotionBall.setMatUniforms(matUnifroms);

        emotionBalls.push(emotionBall);
        emotionBall.balls = emotionBalls;
    }


    let farest = -(emotionBalls.length + 2) * dataViz.rowSpace;
    let control = new Control(8,farest,);
    control.initX =2.;
    
    function update() {

        texture.needsUpdate = true;

        interactionManager.update();
        control.update(camera);

        timeMesh.position.z = camera.position.z - 18;
        timeMesh.position.x = camera.position.x;
        timeMesh.position.y = camera.position.y;


        //update uniforms
        emotionBalls.forEach(item => {
            item.update();
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
        dataViz,
        diaryObjs,

        update,
        addball,
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
    event_afterNaming: scene0.generateEmotionBall
});


// Intrface of writing diary disappear. Current scene is switched to the scene of data archive.

/*----------------------------------ADD ENVENTLISTENER----------------------------------*/
/*--------------------------------------------------------------------------------------------*/

let storeButton = document.querySelector('.storeButton');

storeButton.addEventListener("click", () => {

    /*-------------------------------UPDATE DATABASE--------------------------*/


    let newDiary = diary.getDiaryData();

    // Push data to the data base

    FEELINGDATA.push(newDiary);

    // Create diaryObj from new diary data 

    scene1.addball(newDiary, scene0.getInputUnifroms());

    // Create a ball from new diaryObj 



})


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
        scene0.hideGui();
    }

    pre_writingIsDone = writingIsDone;


   // transition.update();

    scene1.update();
    renderer.render(scene1.scene, scene1.camera);

    TWEEN.update();



};
animate();