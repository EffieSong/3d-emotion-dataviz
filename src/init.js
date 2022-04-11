import * as THREE from 'three'
import Control from './components/controls/control'
import Diary from './components/WrtingUI/Diary'
import DataViz from './DataViz'
import dataProcessing from './components/dataVizScene/dataProcessing'
const tHuman = require("./assets/textures/human.png")
import {
    vertex_human,
    fragment_human
} from './shaders/human/shader'




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



/*---------------------------------------ADD HUMAN MESH---------------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let Mat_human = new THREE.ShaderMaterial({
    vertexShader: vertex_human,
    fragmentShader: fragment_human,
    transparent: true,
    // blending: THREE.LightenBlending,
    uniforms: {
        u_time: {
            value: 0
        },
        tOne: {
            type: "t",
            value: THREE.ImageUtils.loadTexture(tHuman)
        },
        u_colorNum: {
            value: 1
        },
        u_colors: {
            value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
        }
    }
})
let planeGeometry = new THREE.PlaneGeometry(3, 3);
let human = new THREE.Mesh(planeGeometry, Mat_human);
//scene.add(human);



/*---------------------------------------ADD WRITING COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/

// Get coresponding colors from text input based on a defined rule (emotion wheel)
function getEmotionColors(input,rule) {
    let emotions = input.split(', ');
    let colors = [];
    emotions.forEach(emo => {
        let color = rule.find(item => {
            return item.emotion == emo;
        }).color;
        colors.push(color);
    });
    return colors;
}

function updateEmotionColor(input,rule) {
    let colors = [...getEmotionColors(input,rule)];
    let num = colors.length;

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



/*---------------------------------------ADD EVENT LISTENERS----------------------------------*/
/*--------------------------------------------------------------------------------------------*/



/*---------------------------------------ADD 3DDATAVIZ COMPONENT---------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let dataViz = new DataViz();
let _processedData = dataProcessing(
    dataViz,
    scene
);


/*-----------------------------------SET UP CONTROL & HELPER----------------------------------*/
/*--------------------------------------------------------------------------------------------*/
let control = new Control();
control.farest = -_processedData.length * dataViz.rowSpace;
console.log(control.farest);

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
  renderer.render(scene, camera);
  //update uniforms

  _processedData.forEach(item=>{
    item.material.uniforms.u_time.value = item.randomValue+(Date.now() - start_time) * .001;
  });

};
animate();

