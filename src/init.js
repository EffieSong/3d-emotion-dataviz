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
    let bgColor = new THREE.Color(0x0a0b0e);  //"rgb(164, 200, 176)" 
   // let bgColor = new THREE.Color("rgb(253, 248, 217)" );  //"rgb(164, 200, 176)" 


    const loader = new THREE.TextureLoader();


   // scene.background = bgColor;
    scene.background = loader.load('https://cdn.glitch.global/a4736c11-de07-4635-9945-32b33564692f/bg2.png?v=1652933429322');

    scene.fog = new THREE.Fog(bgColor, 1., 25.);

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    // camera.position.z = 5;
    // camera.position.y = 10;

    let bgPlaneGeo = new THREE.PlaneGeometry(300, 300);

    let Mat_bgPlane = new THREE.ShaderMaterial({
        vertexShader: `
        varying vec2 vUv;
        uniform float u_scale;
        
        void main()
        {
            vUv = uv;
           // make it sprite
            float rotation = 0.0;
          
            vec3 alignedPosition = position;
            vec2 pos = alignedPosition.xy;
          
            vec2 rotatedPosition;
            rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
            rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;
          
            vec4 finalPosition;
          
            finalPosition = modelViewMatrix * vec4(1.0,0.0,0.0, 1.0);
            finalPosition.xy += rotatedPosition;
            finalPosition = projectionMatrix * finalPosition;
          
            gl_Position = finalPosition;
            
            // vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            // gl_Position = projectionMatrix * mvPosition;
        }
        `,
        fragmentShader: `
        uniform float u_time;
        uniform float u_motionSpeed;
        uniform vec3 u_colors[2];
        
        varying vec2 vUv;
        
        vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec2 mod289(vec2 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
        }
        vec3 permute(vec3 x) {
            return mod289(((x * 34.0) + 1.0) * x);
        }
        vec2 random2(vec2 st) {
            st = vec2(dot(st, vec2(97.1, 311.7)),
                dot(st, vec2(69.5, 183.3)));
        
            return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
        }
        vec3 random3(vec3 c) {
            float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
            vec3 r;
            r.z = fract(512.0*j);
            j *= .125;
            r.x = fract(512.0*j);
            j *= .125;
            r.y = fract(512.0*j);
            return r-0.5;
        }
        
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        
        float snoise2(vec2 v) {
            const vec4 C = vec4(0.211324865405187, // (3.0-sqrt(3.0))/6.0
                0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
                -0.577350269189626, // -1.0 + 2.0 * C.x
                0.024390243902439); // 1.0 / 41.0
            vec2 i = floor(v + dot(v, C.yy));
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod289(i); // Avoid truncation effects in permutation
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) +
                i.x + vec3(0.0, i1.x, 1.0));
        
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
            m = m * m;
            m = m * m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
            vec3 g;
            g.x = a0.x * x0.x + h.x * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 140.0 * dot(m, g);
        }
        /* 3d simplex noise */
        float snoise3(vec3 p) {
            /* skew constants for 3d simplex functions */
         float F3 =  0.3333333;
         float G3 =  0.1666667;
             /* 1. find current tetrahedron T and it's four vertices */
             /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
             /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
             
             /* calculate s and x */
             vec3 s = floor(p + dot(p, vec3(F3)));
             vec3 x = p - s + dot(s, vec3(G3));
             
             /* calculate i1 and i2 */
             vec3 e = step(vec3(0.0), x - x.yzx);
             vec3 i1 = e*(1.0 - e.zxy);
             vec3 i2 = 1.0 - e.zxy*(1.0 - e);
                 
             /* x1, x2, x3 */
             vec3 x1 = x - i1 + G3;
             vec3 x2 = x - i2 + 2.0*G3;
             vec3 x3 = x - 1.0 + 3.0*G3;
             
             /* 2. find four surflets and store them in d */
             vec4 w, d;
             
             /* calculate surflet weights */
             w.x = dot(x, x);
             w.y = dot(x1, x1);
             w.z = dot(x2, x2);
             w.w = dot(x3, x3);
             
             /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
             w = max(0.6 - w, 0.0);
             
             /* calculate surflet components */
             d.x = dot(random3(s), x);
             d.y = dot(random3(s + i1), x1);
             d.z = dot(random3(s + i2), x2);
             d.w = dot(random3(s + 1.0), x3);
             
             /* multiply d by w^4 */
             w *= w;
             w *= w;
             d *= w;
             
             /* 3. return the sum of the four surflets */
             return dot(d, vec4(52.0));
        }
        
        float noise2(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
        
            vec2 u = f * f * (3.0 - 2.0 * f);
        
            return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                    dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                    dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
        }
        
        float noiseShape(vec2 st, float radius,float edgeSmooth, float amplitude,float motionSpeed, float offset) {
            st = vec2(0.5)-st;
            float r = length(st)*2.0;
            float a = atan(st.y,st.x);
            float m = abs(mod(a+u_time*2.,3.14*2.)-3.14)/2.864;
            float f = radius;
            m += noise2(st+u_time*0.1)*.5;
            f += sin(a*1.)*noise2(st+u_time*0.2+offset)*.2;
            f += sin(a*3.)*noise2(st+u_time*1.9*motionSpeed+offset)*.2*amplitude;
            f += sin(a*1.)*noise2(st+u_time*2.2*motionSpeed+offset)*0.9*amplitude;
            return smoothstep(f-edgeSmooth/2.,f+edgeSmooth/2.,r);
        }
        
        void main()
        {
            vec2 st =vUv;

        
            float x = st.x;
            float y = st.y; 
        
            vec3 color = vec3(0.625, 0.205, 0.235);
            float xoff = snoise2(st + u_time * .15) * 0.2;
            vec2 pos = vec2(st * vec2(1., 2.2) * 0.7);
            pos.x += xoff;
        
            float DF = 0.;
            float scale1 = 0.1;
            float scale2 = 0.3;
        
            // Add a random position
            vec2 vel = vec2(0.3, 0.6);//第一层noise的运动方向
            DF += snoise2(pos) * scale1;
            
            // Add a random position
            DF += snoise2(pos - vel*u_time  * u_motionSpeed * 1.9) * scale2;///*****intensity
            DF += 0.5;
        
            float colorRange = floor(10.*(1./2.))/10.;

            float mixRange = 0.3;

            color = mix(u_colors[0], u_colors[1], smoothstep(1.*colorRange-mixRange, 1.*colorRange+mixRange, DF));

        
            color += vec3(snoise2(random2(st)) * 0.01);
            
            vec4 bg = vec4(0.0, 0.0, 0.0, 0.0);
        
        
            vec4 col = vec4(color,1.);
        
            gl_FragColor= vec4(col);
    
        }
        `,
        transparent: true,
        blending: THREE.LightenBlending,
        uniforms: {
            u_time: {
                value: 0
            },
            u_colorNum: {
                value: 2.
            },
            u_colors: {
               // value: [new THREE.Color("rgb(253, 248, 217)"), new THREE.Color("rgb(238, 248, 249)")]
               value: [new THREE.Color("rgb(2, 2, 15)"), new THREE.Color("rgb(0, 0, 0)")]

            },
            u_motionSpeed:{
                value: 0.1
            }
        }
    });
  
    let bgMesh = new THREE.Mesh(bgPlaneGeo,Mat_bgPlane);
    bgMesh.position.set(0,0,-100);
    bgMesh.position.z = camera.position.z - 100;
    bgMesh.position.x = camera.position.x;
    bgMesh.position.y = camera.position.y;
    scene.add(bgMesh);






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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '30pt Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text + ` April, 2022`, canvas.width / 2, canvas.height / 2);
    }

    let texture = new THREE.Texture(canvas);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1.0
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
    let control = new Control(8, farest, );
    control.initX = 2.;

    let start_time = Date.now();
    function update() {

        texture.needsUpdate = true;

        interactionManager.update();
        control.update(camera);

        timeMesh.position.z = camera.position.z - 18;
        timeMesh.position.x = camera.position.x;
        timeMesh.position.y = camera.position.y;

        bgMesh.material.uniforms.u_time.value = (Date.now() - start_time) * .0005;



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


    transition.update();

   // scene1.update();
    //renderer.render(scene1.scene, scene1.camera);

    TWEEN.update();



};
animate();