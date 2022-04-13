//Class of visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.
//Add interaction logic for each visual representation of the data

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'

import {
    vertex_emotionBall,
    fragment_emotionBall
} from '../../shaders/emotionBall/shader'

export default class EmotionBall {
    constructor(opt = {}) {
        this.diaryObj = opt.diaryObj; // :DiaryObj , data of diary content
        this.colSpace = opt.colSpace; // :num
        this.rowSpace = opt.rowSpace; // :num
        this.interactionManager = opt.interactionManager; //:InteractionManager
        this.scene = opt.scene

        this.isActive = false;
        this.randomValue = 10 * Math.random(); // add a randomValue parameters to each data, which is used in updating uniforms
        this.transform = {
            scale: 1
        }
        this.start_time = Date.now();
        this.meshGroup = new THREE.Group();


        // Computed variables
        this.ballMesh = this.createBallMesh();


        this.init();
 
    }

    init() {
        this.createTextMesh();
        this.scene.add(this.meshGroup);


        // Add interaction and animation

        const tween1 = new TWEEN.Tween(this.transform) // scale up
            .to({
                scale: 2.
            }, 400)
            .easing(TWEEN.Easing.Quadratic.Out);
        const tween2 = new TWEEN.Tween(this.transform) // scale down
            .to({
                scale: 1
            }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);


        this.interactionManager.add(this.ballMesh);
        this.ballMesh.addEventListener("click", (event) => {
            console.log(event.target.emotionInfo);
        });
        this.ballMesh.addEventListener("mouseover", (event) => {
            document.body.style.cursor = "pointer";
            let s = event.target.scale;
            this.transform.scale = s.x;
            tween1.onUpdate(() => {
                s.set(this.transform.scale, this.transform.scale, this.transform.scale);
            });
            tween1.start();
        });

        this.ballMesh.addEventListener("mouseout", (event) => {
            document.body.style.cursor = "default";
            let s = event.target.scale;
            tween2.onUpdate(() => {
                s.set(this.transform.scale, this.transform.scale, this.transform.scale);
            });
            tween1.stop();
            tween2.start();
        });

    }

    createBallMesh() {
        let planeWidth = this.transform.scale * this.colSpace;
        let planeGeometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
        let Mat = new THREE.ShaderMaterial({
            vertexShader: vertex_emotionBall,
            fragmentShader: fragment_emotionBall,
            transparent: true,
            blending: THREE.LightenBlending,
            uniforms: {
                u_time: {
                    value: 0
                },
                u_colorNum: {
                    value: this.diaryObj.emotions.length
                },
                u_colors: {
                    value: [...this.diaryObj.emotionColors]
                }
            }
        })
        let plane = new THREE.Mesh(planeGeometry, Mat);
        plane.emotionInfo = this.diaryObj.emotions; // Add information to the plane

        // Compute placement X, Y, Z

        this.position = new THREE.Vector3(
            this.diaryObj.eventTypeIndex * this.colSpace, // placement X
            Math.random() * 2.5 + 0.5, // placement Y
            -this.diaryObj.index * this.rowSpace // placement Z
        );
        plane.position.set(this.position.x, this.position.y, this.position.z);
        this.meshGroup.add(plane);

        return plane;
    }

    createTextMesh() {
        const loader = new FontLoader();
        loader.load('https://threejs.org//examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const color = new THREE.Color("rgb(255,255,255)");

            const mat_font = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });

            let message = this.diaryObj.nameOfFeelings;


            const fontShape = font.generateShapes(message, 0.1 * this.rowSpace);
            const geometry = new THREE.ShapeGeometry(fontShape);
            geometry.computeBoundingBox();
          //  geometry.translate(this.position.x, this.position.x, this.position.z);

            // make shape
            console.log( this.position);
            console.log( geometry);
           


            this.textMesh = new THREE.Mesh(geometry, mat_font);
            this.textMesh.position.set(this.position.x, this.position.y-0.7*this.rowSpace, this.position.z);
            console.log( this.textMesh.position);
            this.scene.add(this.textMesh);
        })


    }

    update() {
        this.ballMesh.material.uniforms.u_time.value = this.randomValue + (Date.now() - this.start_time) * .001;

    }
}