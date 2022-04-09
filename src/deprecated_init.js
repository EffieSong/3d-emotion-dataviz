import * as THREE from 'three';
import "./style.css";
import Control from './components/controls/control'
import Diary from './components/WrtingUI/Diary.js'
import DataViz from './DataViz'

import vertex_plane from './shaders/emotionBall/vertexShader.glsl'
import fragment_plane from './shaders/emotionBall/vertexShader.glsl'


import {
    RULE
} from './components/WrtingUI/scriptableObj.js'

const tHuman = require("./assets/textures/human.png")
// import {
//     vertex_human,
//     fragment_human
// } from './shaders/human/shader'
const OrbitControls = require("three-orbit-controls")(THREE);
import {
    FEELINGDATA
} from './components/diaryData/FEELINGDATA'
import FeelingDataVis from './components/dataVizScene/FeelingDataVis'
import dataProcessing from './components/dataVizScene/dataProcessing'
import createBall from './components/dataVizScene/createBall';




/*------------------------------ SET UP THREE ENVIRONMENT-------------------------------*/
/*--------------------------------------------------------------------------------------*/

//set up renderer

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('black', 1);
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
camera.position.z = 100;
camera.position.y = 20;


/*-----------------------------------SET UP CONTROL & HELPER----------------------------------*/
/*--------------------------------------------------------------------------------------------*/

let control = new Control();
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
//const controls = new OrbitControls(camera, renderer.domElement);



/*---------------------------------------WINDOW RESIZE---------------------------------------*/
/*--------------------------------------------------------------------------------------------*/

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);






/*---------------------------------------ADD HUMAN MESH---------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
// let Mat_human = new THREE.ShaderMaterial({
//     vertexShader: vertex_human,
//     fragmentShader: fragment_human,
//     transparent: true,
//     // blending: THREE.LightenBlending,
//     uniforms: {
//         u_time: {
//             value: 0
//         },
//         tOne: {
//             type: "t",
//             value: THREE.ImageUtils.loadTexture(tHuman)
//         },
//         u_colorNum: {
//             value: 1
//         },
//         u_colors: {
//             value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
//         }
//     }
// })
// let plane = new THREE.Mesh(planeGeometry, Mat_human);
// scene.add(plane);



/*---------------------------------------ADD WRITING COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/


function getEmotionColor(input) {
    let emotions = input.split(', ');
    let colors = [];
    emotions.forEach(emo => {
        let color = RULE.find(item => {
            return item.emotion == emo;
        }).color;
        colors.push(color);
    });
    return colors;
}

function updateEmotionColor(input) {
    let colors = [...getEmotionColor(input)];
    let num = colors.length;
    console.log("updateEmotionColor");

    Mat_human.uniforms.u_colors.value.splice(0, num, ...colors);
    Mat_human.uniforms.u_colorNum.value = num;
}
let diary = new Diary({
    parentWrapper: document.querySelector(".writingContainer"),
    submitBtn: document.querySelector(".submitButton"),
    inputBox: document.querySelector(".textarea"),
    callback: updateEmotionColor
});

/*---------------------------------------FETCH DATA -----------------------------------------*/
/*--------------------------------------------------------------------------------------------*/


let _processedData = dataProcessing();

/*---------------------------------------ADD EVENT LISTENERS----------------------------------*/
/*--------------------------------------------------------------------------------------------*/




/*---------------------------------------ADD 3DDATAVIZ COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/

const FeelingData = new FeelingDataVis({
    data: FEELINGDATA,
    scene: scene
});

let dataViz = new DataViz();
console.log(dataViz);

// let testBall = createBall();
// console.log(testBall);
let ballParams = {
    colMix: 0.9
}

let Mat1 = new THREE.ShaderMaterial({
    vertexShader: vertex_plane,
    fragmentShader: fragment_plane,
    transparent: true,
    blending: THREE.LightenBlending,
    uniforms: {
        uTime: {
            value: 0
        },
        diffuse: {
            value: new THREE.Color('white')
        },
        fresnelColor: {
            value: new THREE.Color('yellow')
        },
        uColMix: {
            value: ballParams.colMix
        },
        uFrequency: {
            value: 0.
        },
    }
});

let planeGeometry = new THREE.PlaneGeometry(3, 3);
let ball = new THREE.Mesh(planeGeometry, Mat1);
scene.add(ball);

/*---------------------------------------ANIMATE & RENDER------------------------------------*/
/*--------------------------------------------------------------------------------------------*/


const animate = function () {
    requestAnimationFrame(animate);
    control.update(camera);
    renderer.render(scene, camera);
    //update uniforms
    
};
animate();