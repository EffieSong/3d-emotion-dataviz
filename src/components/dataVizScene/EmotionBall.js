//Class of visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.
//Add interaction logic for each visual representation of the data

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import BallInfo from '../UI/BallInfo'
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'

import {
    vertex_emotionBall,
    fragment_emotionBall
} from '../../shaders/emotionBall/shader'
import EmotiveGenerator from '../EmotiveGenerator'


export default class EmotionBall {
    constructor(opt = {}) {
        this.diaryObj = opt.diaryObj; // :DiaryObj , data of diary content
        this.colSpace = opt.colSpace; // :num
        this.rowSpace = opt.rowSpace; // :num
        this.interactionManager = opt.interactionManager; //:InteractionManager
        this.emotiveGenerator = new EmotiveGenerator();
        this.scene = opt.scene;
        this.camera = opt.camera;
        this.offsetX = opt.offsetX; // translate the mesh group to place it at the center

        this.isMuted = false;
        this.ishover = false;
        this.isClicked = false;
        this.randomValue = 10 * Math.random(); // add a randomValue parameters to each data, which is used in updating uniforms
        this.transform = {
            scale: 1
        }

        this.textParameters = {
            opacity: 0
        }
        this.start_time = Date.now();
        this.meshGroup = new THREE.Group(); // include ballMesh and textMesh

        this.Mat = this.createMat();
        // Computed variables

        this.init();

    }
    //
    init() {
        const loader = new FontLoader();

        loader.load('https://threejs.org//examples/fonts/helvetiker_regular.typeface.json', (font) => {

            // Create visual and text object   

            this.createBallMesh();
            //  this.createSPMesh();
            this.createTextMesh(font);

            this.meshGroup.position.x += this.offsetX; // translate the mesh group to place it at the center 

            this.render();

            // Add interaction and animation


            this.interactionManager.add(this.ballMesh);

            document.addEventListener('click', () => {

                if (this.ishover && !this.isClicked) {
                    this.onMouseClick();
                }

                if (this.isClicked && !this.ishover) {

                    this.onMouseClickOut();

                }

                document.body.style.cursor = "default";

            });



            this.ballMesh.addEventListener("mouseover", (event) => {

                this.ishover = !this.isMuted ? true : false;

                if (!this.isClicked && !this.isMuted) {
                    document.body.style.cursor = "pointer";

                    // ball scale up

                    let transform = {
                        scale: this.ballMesh.scale.x
                    };

                    if (this.tween_ballScaleDown != undefined) this.tween_ballScaleDown.stop();

                    this.tween_ballScaleUp = new TWEEN.Tween(transform) // scale up
                        .to({
                            scale: 2.
                        }, 900)
                        .easing(TWEEN.Easing.Exponential.Out) //Exponential Quadratic
                        .onUpdate(() => {
                            if (!this.isClicked) {
                                this.ballMesh.material.uniforms.u_scale.value = transform.scale;
                                this.ballMesh.scale.set(transform.scale, transform.scale, transform.scale);
                            }
                        }).start();

                    // text appear

                    let textParameters = {
                        opacity: 0
                    }

                    if (this.tween_textHide != undefined) this.tween_textHide.stop();

                    this.tween_textShow = new TWEEN.Tween(textParameters) // text appear
                        .to({
                            opacity: 0.7
                        }, 500)
                        .easing(TWEEN.Easing.Quadratic.Out) //Linear.None
                        .onUpdate(() => {
                            this.textMesh.material.opacity = textParameters.opacity;
                        }).start();
                }
            });

            this.ballMesh.addEventListener("mouseout", (event) => {

                this.ishover = false;
                if (!this.isClicked) {
                    document.body.style.cursor = "default";

                    // // ball scale down

                    this.scaleDownBall(this.tween_ballScaleUp);

                    // text disappear

                    this.textDisappear(this.tween_textShow);


                }
            });

        })
    }

    // calculate the average amount of multi-emotions
    calculateAverage(array, calculatedProperty) { // sumProperty: string

        let sum = array.reduce(function (pre, curr) {

            pre += curr[calculatedProperty];

            return pre;

        }, 0);

        return sum / array.length
    };


    setMatUniforms(opt = {
        lightness: 1.,
        amplitude: 0.1,
        motionSpeed: 0.2,
        edgeSmooth: 0.6,
        glitchFrequency: 0.,
        glitchAmplitude: 0.
    }) {
        this.Mat.uniforms.u_lightness.value = opt.lightness;
        this.Mat.uniforms.u_amplitude.value = opt.amplitude;
        this.Mat.uniforms.u_motionSpeed.value = opt.motionSpeed;
        this.Mat.uniforms.u_edgeSmooth.value = opt.edgeSmooth;
        this.Mat.uniforms.u_glitchFrequency.value = opt.glitchFrequency;
        this.Mat.uniforms.u_glitchAmplitude.value = opt.glitchAmplitude;
    }

    // compute factors of uniforms with the input of multi emotions

    createMat() {

        this.emotiveGenerator.setEmotion(this.diaryObj.emotions);

        let emotiveParam = this.emotiveGenerator.getUniforms();

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
                    value: [...emotiveParam.colors]
                },

                u_scale: {
                    value: 1.
                },

                u_opacity: {
                    value: 1.
                },
                u_saturation: {
                    value: 1.
                },
                u_lightness: {
                    value: emotiveParam.lightness
                },

                u_amplitude: {
                    value: emotiveParam.amplitude
                },
                u_motionSpeed: {
                    value: emotiveParam.motionSpeed
                },
                u_edgeSmooth: {
                    value: emotiveParam.edgeSmooth
                },
                u_glitchFrequency: {
                    value: emotiveParam.glitchFrequency
                },
                u_glitchAmplitude: {
                    value: emotiveParam.glitchAmplitude
                },
                u_fogColor: {
                    type: "c",
                    value: this.scene.fog.color
                },
                u_fogNear: {
                    type: "f",
                    value: this.scene.fog.near
                },
                u_fogFar: {
                    type: "f",
                    value: this.scene.fog.far
                },
            }
        })

       // this.setMatUniforms(emotiveParam);

        return Mat;
    }

    createBallMesh() {
        let planeWidth = this.transform.scale * this.colSpace;
        let planeGeometry = new THREE.PlaneGeometry(planeWidth, planeWidth);

        // this.createMat();

        this.ballMesh = new THREE.Mesh(planeGeometry, this.Mat);
        this.ballMesh.emotionInfo = this.diaryObj.emotions; // Add information to the plane

        // Compute placement X, Y, Z

        this.position = new THREE.Vector3(
            this.diaryObj.eventTypeIndex * this.colSpace, // placement X
            Math.random() * 2.5 + 0.5, // placement Y
            -this.diaryObj.index * this.rowSpace * 1 -this.rowSpace/2 // placement Z
        );
        this.ballMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.meshGroup.add(this.ballMesh);
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


        const fontShape = font.generateShapes(message, 0.05 * this.rowSpace);

        const geometry = new THREE.ShapeGeometry(fontShape);

        geometry.computeBoundingBox();

        let width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;

        geometry.translate(-width / 2, 0, 0); // put the anchor the the textShape at the center

        // Create mesh

        this.textMesh = new THREE.Mesh(geometry, mat_font);

        this.textMesh.position.set(this.position.x, this.position.y - 0.4 * this.rowSpace, this.position.z);
        
        this.meshGroup.add(this.textMesh);
    }


    textDisappear(tween_pre) {

        if (tween_pre != undefined) tween_pre.stop();

        let textParameters = {
            opacity: this.textMesh.material.opacity
        }

        this.tween_textHide = new TWEEN.Tween(textParameters)
            .to({
                opacity: 0
            }, 300)
            .easing(TWEEN.Easing.Linear.None).onUpdate(() => {
                this.textMesh.material.opacity = textParameters.opacity;
            }).start();
    }

    scaleDownBall(tween_pre) {

        if (tween_pre != undefined) tween_pre.stop();

        let transform = {
            scale: this.ballMesh.scale.x
        };

        this.tween_ballScaleDown = new TWEEN.Tween(transform)
            .to({
                scale: 1, //`-${d_ball}`
            }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {

                this.ballMesh.material.uniforms.u_scale.value = transform.scale;
                this.ballMesh.scale.set(transform.scale, transform.scale, transform.scale);

            }).start();
    }

    render() {
        this.scene.add(this.meshGroup);
    };

    update() {

        // update visual

        if (this.ballMesh != null && this.ballMesh.material != null) {
            this.ballMesh.material.uniforms.u_time.value = this.randomValue + (Date.now() - this.start_time) * .001;
            this.ballMesh.material.uniforms.u_opacity.value = this.isMuted ? 0.15 : 1.;
            this.ballMesh.material.uniforms.u_saturation.value = this.isMuted ? 0. : 1.;
        }
    }

    onMouseClick() {
        let target = new THREE.Vector3();
        target.addVectors(this.camera.position, new THREE.Vector3(0, 0, -this.rowSpace * 2.));

        let d = new THREE.Vector3();
        d.subVectors(target, this.ballMesh.position)

        //place the chosen ball in front of the camera

        let sceneTranslate1 = {
            x: 0,
            y: 0,
            z: 0
        };

        const tween_sceneTranslate1 = new TWEEN.Tween(sceneTranslate1)
            .to({
                x: d.x - this.offsetX + this.colSpace * 0.9,
                y: d.y - this.colSpace * 0.8,
                z: d.z
            }, 800)

            .easing(TWEEN.Easing.Cubic.Out)

            .onUpdate(() => {

                this.scene.position.x = sceneTranslate1.x;
                this.scene.position.y = sceneTranslate1.y;
                this.scene.position.z = sceneTranslate1.z;
            })

            .start();

        // update balls' states; only show the clicked ball

        this.balls.forEach(item => {
            item.isMuted = true;
        });

        this.isMuted = false;

        this.isClicked = true;

        // show related data Info of this ball

        let ballInfo = BallInfo(this.diaryObj);
        ballInfo.show();

    }

    onMouseClickOut() {

        //scale down the chosen ball; hide the name tag

        this.scaleDownBall(this.tween_ballScaleUp);
        this.textDisappear(this.tween_textShow);


        //place back the chosen ball 

        let sceneTranslate2 = {
            x: this.scene.position.x,
            y: this.scene.position.y,
            z: this.scene.position.z
        };

        const tween_sceneTranslate2 = new TWEEN.Tween(sceneTranslate2)
            .to({
                x: 0,
                y: 0,
                z: 0,
            }, 800)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                this.scene.position.x = sceneTranslate2.x;
                this.scene.position.y = sceneTranslate2.y;
                this.scene.position.z = sceneTranslate2.z;
            })
            .start();


        //  update balls' states; show other balls

        this.balls.forEach(item => {
            item.isMuted = false;
        });

        this.isClicked = false;

        // hidde related data Info of this ball

        let ballInfo = BallInfo(this.diaryObj);
        ballInfo.hidden();
    }

}