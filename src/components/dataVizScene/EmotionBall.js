//Class of visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.
//Add interaction logic for each visual representation of the data

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import BallInfoAppear from '../UI/BallInfoAppear'
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
        this.scene = opt.scene;
        this.camera = opt.camera;
        this.offsetX = opt.offsetX // translate the mesh group to place it at the center

        this.isMuted = false;
        this.randomValue = 10 * Math.random(); // add a randomValue parameters to each data, which is used in updating uniforms
        this.transform = {
            scale: 1
        }
        this.textParameters = {
            opacity: 0
        }
        this.start_time = Date.now();
        this.meshGroup = new THREE.Group(); // include ballMesh and textMesh

        // Computed variables

        this.init();

    }

    init() {
        const loader = new FontLoader();
        loader.load('https://threejs.org//examples/fonts/helvetiker_regular.typeface.json', (font) => {

            // Create visual and text object   

            this.createBallMesh();
            this.createTextMesh(font);
            this.meshGroup.position.x += this.offsetX; // translate the mesh group to place it at the center 
            this.render();

            // Add interaction and animation

            const tween_ballScale_1 = new TWEEN.Tween(this.transform) // scale up
                .to({
                    scale: 2.
                }, 900)
                .easing(TWEEN.Easing.Exponential.Out); //Exponential Quadratic

            const tween_textOpacity_1 = new TWEEN.Tween(this.textParameters) // text appear
                .to({
                    opacity: 0.7
                }, 500)
                .easing(TWEEN.Easing.Quadratic.Out); //Linear.None

            this.interactionManager.add(this.ballMesh);

            this.ballMesh.addEventListener("click", (event) => {
                this.onMouseClick();
            });

            this.ballMesh.addEventListener("mouseover", (event) => {
                document.body.style.cursor = "pointer";

                // ball scale up
                tween_ballScale_1.onUpdate(() => {
                    this.ballMesh.scale.set(this.transform.scale, this.transform.scale, this.transform.scale);
                }).start();

                // text appear
                tween_textOpacity_1.onUpdate(() => {
                    this.textMesh.material.opacity = this.textParameters.opacity;
                }).start();
            });

            this.ballMesh.addEventListener("mouseout", (event) => {
                document.body.style.cursor = "default";

                // ball scale down
                let d_ball = this.transform.scale - 1; // relative tween values
                tween_ballScale_1.stop();
                const tween_ballScale_2 = new TWEEN.Tween(this.transform)
                    .to({
                        scale: `-${d_ball}`
                    }, 500)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .onUpdate(() => {
                        this.ballMesh.scale.set(this.transform.scale, this.transform.scale, this.transform.scale);
                    }).start();

                // text disappear
                let d_text = this.textMesh.material.opacity; // relative tween values
                tween_textOpacity_1.stop();
                const tween_textOpacity_2 = new TWEEN.Tween(this.textParameters)
                    .to({
                        opacity: `-${d_text}`
                    }, 300)
                    .easing(TWEEN.Easing.Linear.None).onUpdate(() => {
                        this.textMesh.material.opacity = this.textParameters.opacity;
                    }).start();
            });
        })
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
                },
                u_opacity:{
                    value:1
                },
                u_saturation:{
                    value:1
                }
            }
        })
        this.ballMesh = new THREE.Mesh(planeGeometry, Mat);
        this.ballMesh.emotionInfo = this.diaryObj.emotions; // Add information to the plane

        // Compute placement X, Y, Z

        this.position = new THREE.Vector3(
            this.diaryObj.eventTypeIndex * this.colSpace, // placement X
            Math.random() * 2.5 + 0.5, // placement Y
            -this.diaryObj.index * this.rowSpace // placement Z
        );
        this.ballMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.meshGroup.add(this.ballMesh);

        // return plane;
    }
    createTextMesh(font) {
        const color = new THREE.Color("rgb(255,255,255)");
        const mat_font = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.,
            side: THREE.DoubleSide
        });

        let message = this.diaryObj.nameOfFeelings;


        const fontShape = font.generateShapes(message, 0.1 * this.rowSpace);
        const geometry = new THREE.ShapeGeometry(fontShape);
        geometry.computeBoundingBox();
        let width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        geometry.translate(-width / 2, 0, 0); // put the anchor the the textShape at the center

        // Create mesh

        this.textMesh = new THREE.Mesh(geometry, mat_font);
        this.textMesh.position.set(this.position.x, this.position.y - 0.9 * this.rowSpace, this.position.z);
        this.meshGroup.add(this.textMesh);
    }

    render() {
        this.scene.add(this.meshGroup);
    };

    update() {
        if (this.ballMesh != null) this.ballMesh.material.uniforms.u_time.value = this.randomValue + (Date.now() - this.start_time) * .001;
        this.ballMesh.material.uniforms.u_opacity.value = this.isMuted?0.15:1.;
        this.ballMesh.material.uniforms.u_saturation.value = this.isMuted?0.:1.;

    }
    onMouseClick() {
        let target = new THREE.Vector3();
        target.addVectors(this.camera.position, new THREE.Vector3(0, 0, -this.rowSpace*2));
        let d = new THREE.Vector3();
        d.subVectors(target, this.position)

        //place the chosen ball in front of the camera
        this.sceneTranslate = {
            x:0,
            y:0,
            z:0
        };
        const tween_sceneTranslate = new TWEEN.Tween(this.sceneTranslate)
        .to({
           x: d.x-this.offsetX+this.rowSpace*1,
           y: d.y-this.rowSpace*0.8,
           z: d.z
        }, 800)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(() => {
            this.scene.position.x = this.sceneTranslate.x;
            this.scene.position.y = this.sceneTranslate.y;
            this.scene.position.z = this.sceneTranslate.z;
        }).start();

        // only show the clicked ball
        this.balls.forEach(item=>{
            item.isMuted = true;
        });
        this.isMuted = false;
        BallInfoAppear();
      
    }
}