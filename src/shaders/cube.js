import * as THREE from 'three';
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    MarchingCubes
} from 'three/examples/jsm/objects/MarchingCubes.js';
import {
    ToonShader1,
    ToonShader2,
    ToonShaderHatching,
    ToonShaderDotted
} from 'three/examples/jsm/shaders/ToonShader.js';
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let container, stats;

let camera, scene, renderer;

let materials;

let light, pointLight, ambientLight;

let effect, resolution;
// let controls;

let effectController;

effectController = {

    // material: 'shiny',

    speed: .65,
    numBlobs: 6,
    resolution: 68,
    isolation: 50,

    floor: true,
    wallx: false,
    wallz: false,

    dummy: function () {}

};

let time = 0;

const clock = new THREE.Clock();
const canvas = document.querySelector('canvas.webgl')
init();
animate();

function init() {

    container = document.getElementById('container');

    // CAMERA

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1500);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1E23D2);

    // LIGHTS

    ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

//     const light = new THREE.DirectionalLight( 0xFFFFFF );
// const helper = new THREE.DirectionalLightHelper( light, 5 );
// scene.add( helper );

    // MATERIALS
// attribute B
    materials = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: .1,
        ior: 2.9,
        alphaMap: texture,
        transmission: 1, // use material.transmission for glass materials
        specularIntensity: -7,
        specularColor: 0x000000,
        opacity: 1,
        thickness: .05,
        side: THREE.DoubleSide,
        transparent: true
    });
    // current_material = 'shiny';

    // MARCHING CUBES

    resolution = 148;

    effect = new MarchingCubes(resolution, materials, true, true, 100000);
    effect.position.set(0, 0, 0);
    effect.scale.set(700, 700, 700);

    effect.enableUvs = false;
    effect.enableColors = false;

    scene.add(effect);

    // RENDERER

    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // CONTROLS


    // controls.minDistance = 500;
    // controls.maxDistance = 5000;

    // EVENTS

    window.addEventListener('resize', onWindowResize);
    // controls.update();

}

//

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}
//
var loader = new THREE.TextureLoader();
// var texture = new THREE.TextureLoader().load("









var poster_plain = new THREE.BoxBufferGeometry(2100, 2100, 200);
var poster_plainm = new THREE.MeshLambertMaterial({
    color:0x000B82,
});
let posterpp = new THREE.Mesh(poster_plain,poster_plainm);
posterpp.position.z =-451;
scene.add(posterpp);

var poster_material = new THREE.MeshLambertMaterial({
    map: texture
});

var poster_geometry = new THREE.BoxBufferGeometry(618.2,1100, 200);
// (1100, 1100, 200);
// (618.2,1100, 200);
console.log(texture);
let poster = new THREE.Mesh(poster_geometry, poster_material);
poster.position.z =-450;
scene.add(poster);


// this controls content of marching cubes voxel field

function updateCubes(object, time, numblobs, floor, wallx, wallz) {

    object.reset();

    // fill the field with some metaballs
    const subtract = 18;
    const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {

        const ballx = Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5;
        const bally = Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77+.1; // dip into the floor
        const ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.27 + .5;

        object.addBall(ballx, bally, ballz, strength, subtract);

    }

    if (floor) object.addPlaneY(2, 12);
    if (wallz) object.addPlaneZ(2, 12);
    if (wallx) object.addPlaneX(2, 12);

}

//

function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
}

const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
const blocker = document.getElementById('blocker');
blocker.style.display = 'none';
controls.addEventListener('start', function () {
    blocker.style.display = '';
});
controls.addEventListener('end', function () {
    blocker.style.display = 'none';
});

function render() {
    // control.update();
    const delta = clock.getDelta();

    time += delta * effectController.speed * 0.5;

    // marching cubes

    if (effectController.resolution !== resolution) {

        resolution = effectController.resolution;
        effect.init(Math.floor(resolution));

    }

    if (effectController.isolation !== effect.isolation) {

        effect.isolation = effectController.isolation;

    }

    updateCubes(effect, time, effectController.numBlobs, false, effectController.wallx, effectController.wallz);

    // render
    // controls.update();

    renderer.render(scene, camera);

}