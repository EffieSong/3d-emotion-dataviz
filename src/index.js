import * as THREE from 'three'
import {
  OrbitControls
} from 'three/examples/jsm/controls/OrbitControls'
import {
  TransformControls
} from 'three/examples/jsm/controls/TransformControls'

import Stats from 'three/examples/jsm/libs/stats.module.js';

import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {
  UnrealBloomPass
} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import Model from './components/model'
import CustomMaterial from './ExtendMaterial.js'
import vertex_plane from './shader/vertexShader.glsl'
import fragment_plane from './shader/fragmentShader.glsl'
import {
  Vector3
} from 'three';


let statusEl = document.querySelector(".modelStatus");
let submitBtn = document.querySelector(".submitButton");
let inputBox = document.querySelector(".textarea");
let sentimentResult = document.querySelector(".sentimentResult");

let sentiment = ml5.sentiment('movieReviews', modelReady);
submitBtn.addEventListener("click", () => {
  generateBall(Math.random());
});

function modelReady() {
  statusEl.innerHTML = 'model loaded';
}

function getSentiment() {
  // get the values from the input
  let text = inputBox.value;
  // make the prediction
  const prediction = sentiment.predict(text);
  // display sentiment result on html page
  sentimentResult.innerHTML = `Sentiment score:${prediction.score}`;
  planeShaderMaterial.uniforms.uColMix.value = prediction.score;
}

/*------------------------------
Mouse control camera's perspective
------------------------------*/
let mouse_xy = [0, 0];
let mouseWheelY = 0;
//dynamic parameters related to camera's position
let delayed_x1 = 0;
let delayed_y1 = 0;
let delayed_mw = 0;
//dynamic parameters related to camera's looking at
let delayed_x2 = 0;
let delayed_y2 = 0;

document.addEventListener('mousemove', event => {
  mouse_xy = [event.clientX, event.clientY];
});
document.addEventListener('mousewheel', event => {
  mouseWheelY += event.wheelDeltaY  * 0.001;
  //restrict range
  mouseWheelY = Math.max(Math.min(8, mouseWheelY), -10);
}, false);

function updatePerspective() {
  let easing = 0.08; //related to camera's position
  let easing2 = 0.04; //related to the point camera is looking at
  let dx = mouse_xy[0] - delayed_x1;
  let dy = mouse_xy[1] - delayed_y1;
  let dz = mouseWheelY - delayed_mw;
  delayed_x1 = Math.abs(dx) > 0.05 ? delayed_x1 + dx * easing : mouse_xy[0];
  delayed_y1 = Math.abs(dy) > 0.05 ? delayed_y1 + dy * easing : mouse_xy[1];
  delayed_mw =  Math.abs(dz) > 0.05 ? delayed_mw + dz * easing : mouseWheelY;
  delayed_x2 = Math.abs(dx) > 0.05 ? delayed_x1 + dx * easing2 : mouse_xy[0];
  delayed_y2 = Math.abs(dy) > 0.05 ? delayed_y1 + dy * easing2 : mouse_xy[1];
  
  let c_x = (delayed_x1 / window.innerWidth - 0.5) * 3;
  let c_y = (1 - delayed_y1 / window.innerHeight + 0.2) * 1.5;
  //p is the point camera is looking at
  let p_x = (delayed_x2 / window.innerWidth - 0.5) * 3;
  let p_y = (1 - delayed_y2 / window.innerHeight + 0.2) * 1.5;

  camera.position.x = c_x;
  camera.position.y = c_y;
  camera.position.z = delayed_mw + 5;
  camera.lookAt(p_x, p_y, camera.position.z - 1);
}



const ballParams = {
  colMix: 0.9
}

let composer;
const bloomParams = {
  exposure: 1,
  bloomStrength: 0.,
  bloomThreshold: 0.7,
  bloomRadius: 0.85
};

/*------------------------------
Renderer
------------------------------*/
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('black', 1);
document.body.appendChild(renderer.domElement);


/*------------------------------
Scene & Camera
------------------------------*/
const scene = new THREE.Scene();
let bgColor = new THREE.Color(0x0B0C24);
scene.background = bgColor;
scene.fog = new THREE.Fog(bgColor, 1., 25.);
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;
camera.position.y = 1;


/*------------------------------
bloom and composer stuff
------------------------------*/
// const renderScene = new RenderPass(scene, camera);
// const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
// bloomPass.threshold = bloomParams.bloomThreshold;
// bloomPass.strength = bloomParams.bloomStrength;
// bloomPass.radius = bloomParams.bloomRadius;

// composer = new EffectComposer(renderer);
// composer.setSize(window.innerWidth, window.innerHeight);
// composer.addPass(renderScene);
// composer.addPass(bloomPass);

/*------------------------------
OrbitControls
------------------------------*/
//const controls = new OrbitControls(camera, renderer.domElement);


// /*------------------------------
// Helpers
// ------------------------------*/
const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


/*------------------------------
Mesh
------------------------------*/


// https://github.com/Fyrestar/THREE.extendMaterial
// let extendShaderMaterial =  THREE.extendMaterial(THREE.MeshStandardMaterial, {

//   material: {
//     transparent: true
//   },
//   // Will be prepended to vertex and fragment code
//   header: 'varying vec3 vNN; varying vec3 vEye;',
//   fragmentHeader: 'uniform vec3 fresnelColor;',
//   // Insert code lines by hinting at a existing

//   vertex: {
//     // Inserts the line after #include <fog_vertex>
//     '#include <fog_vertex>': `

//           mat4 LM = modelMatrix;
//           LM[2][3] = 0.0;
//           LM[3][0] = 0.0;
//           LM[3][1] = 0.0;
//           LM[3][2] = 0.0;

//           vec4 GN = LM * vec4(objectNormal.xyz, 1.0);
//           vNN = normalize(GN.xyz);
//           vEye = normalize(GN.xyz-cameraPosition);`
//   },

//   fragment: {
//     'gl_FragColor = vec4( outgoingLight, diffuseColor.a );': `
// gl_FragColor = vec4(gl_FragColor.rgb, 0.2);
// gl_FragColor.rgba +=  ( 1.0 - -min(dot(vEye, normalize(vNN) ), 0.0) ) * vec4(fresnelColor,0.9)*0.9;
// `
//   },
//   // Uniforms (will be applied to existing or added)
//   uniforms: {
//     diffuse: new THREE.Color('white'),
//     fresnelColor: new THREE.Color('pink')
//   }
// });

// let sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
// let sphereShaderMaterial =  new THREE.ShaderMaterial({
//   vertexShader: vertex_sphere,
//   fragmentShader: fragment_sphere,
//   transparent: true,
//   uniforms: {
//       uTime: { value: 0 },
//       diffuse: { value: new THREE.Color('white')},
//       fresnelColor: {value: new THREE.Color('yellow')}
//   }
// })
// let mesh = new THREE.Mesh(sphereGeometry, sphereShaderMaterial);
// scene.add(mesh);


let planeGeometry = new THREE.PlaneGeometry(3, 3);

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
})


let Materials = [Mat1];

function generateBall(colMix) {
  let mat = new THREE.ShaderMaterial({
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
        value: colMix
      },
      uFrequency: {
        value: 0.5
      },
      fogColor: {
        type: "c",
        value: scene.fog.color
      },
      fogNear: {
        type: "f",
        value: scene.fog.near
      },
      fogFar: {
        type: "f",
        value: scene.fog.far
      },

    },
    fog: true,
  })
  Materials.push(mat);
  let ball = new THREE.Mesh(planeGeometry, mat);
  ball.position.z -= (Math.random() - 0.2) * 20;
  ball.position.x = (Math.random() - 0.5) * 10;
  ball.position.y = Math.random() * 3;
  scene.add(ball);
}

let plane = new THREE.Mesh(planeGeometry, Mat1);
scene.add(plane);


/*------------------------------
Loop
------------------------------*/
let start_time = Date.now();
const animate = function () {
  requestAnimationFrame(animate);
  updatePerspective();
  renderer.render(scene, camera);
  //composer.render();
  //update uniforms
  Materials.forEach(item => {
    item.uniforms.uTime.value = (Date.now() - start_time) * .001;
  });
};
animate();


/*------------------------------
Resize
------------------------------*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);