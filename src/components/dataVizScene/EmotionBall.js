//Class of visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.
//Add interaction logic for each visual representation of the data

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
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


        // Computed variables
        this.ballMesh = this.createBallMesh();
        this.textMesh;

        this.init();

    }

    init() {
        
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

        plane.position.x = this.diaryObj.eventTypeIndex * this.colSpace;
        plane.position.y = Math.random() * 2.5 + 0.5;
        plane.position.z = -this.diaryObj.index * this.rowSpace;

        return plane;
    }

    update() {
        this.ballMesh.material.uniforms.u_time.value = this.randomValue+(Date.now() -  this.start_time) * .001;

    }
}