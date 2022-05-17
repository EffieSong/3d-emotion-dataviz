import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Control from './components/controls/control'
import {
    GUI
} from 'dat.gui'
import {
    EMOTIONMATRIX
} from './components/UI/scriptableObj'
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'
const tHuman = require("./assets/textures/human.png")
const tFloor = require("./assets/textures/shadow.png")
import {
    vertex_human,
    fragment_human,
    vertex_shadow,
    fragment_shadow
} from './shaders/human/shader'
import {
    vertex_emotionBall,
    fragment_emotionBall
} from './shaders/emotionBall/shader'
import {
    vertex_textBubble,
    fragment_textBubble
} from './shaders/textBubble/shader'
import EmotiveGenerator from './components/EmotiveGenerator'


export default () => {
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('https://cdn.glitch.global/a4736c11-de07-4635-9945-32b33564692f/bg.png?v=1652772850815');


    /*------------------------------ SET UP THREE ENVIRONMENT-------------------------------*/
    /*-------------------------------------------------------------------------*/

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(0,0,0)");
   // scene.background = loader.load('https://cdn.glitch.global/a4736c11-de07-4635-9945-32b33564692f/bg2.png?v=1652774525542');;




    // LIGHTS

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0.5, 0.5, 1);
    scene.add(light);

    let pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0x080808);
    scene.add(ambientLight);

    let control = new Control(8, -2, 1, 0.3, 5 * Math.PI / 180, 3.4);


    let bubble;

    /*---------------------------------------CREATE MATERIAL AND MESH-----------------------------*/
    /*--------------------------------------------------------------------------------------------*/

    let Mat_human = new THREE.ShaderMaterial({
        vertexShader: vertex_human,
        fragmentShader: fragment_human,
        transparent: true,
        side: THREE.DoubleSide,
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
            u_saturation: {
                value: 1.
            },
            u_colors: {
                value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
            },
            u_lightness: {
                value: 0.8
            },
            u_contrast: {
                value: 1.1
            }
        }
    })
    let planeGeometry = new THREE.PlaneGeometry(5, 5);
    let human = new THREE.Mesh(planeGeometry, Mat_human);
    human.position.set(0, -0., -3);
    scene.add(human);


    /*-----------------------CREATE FLOOR--------------------------------------------------------*/
    let floorGeometry = new THREE.PlaneGeometry(8, 8);
    // let Mat_floor = new THREE.MeshBasicMaterial();

    let Mat_floor = new THREE.ShaderMaterial({
        vertexShader: vertex_shadow,
        fragmentShader: fragment_shadow,
        transparent: true,
        side: THREE.DoubleSide,
        // blending: THREE.LightenBlending,
        uniforms: {
            u_time: {
                value: 0
            },
            tOne: {
                type: "t",
                value: THREE.ImageUtils.loadTexture(tFloor)
            },
            u_colorNum: {
                value: 1
            },
            u_saturation: {
                value: 1
            },
            u_colors: {
                value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
            }
        }
    })

    let floor = new THREE.Mesh(floorGeometry, Mat_floor);
    floor.rotateX(-90 * Math.PI / 180);
    floor.position.set(0, -2.2, -3);
    scene.add(floor);


    // Create material considering the factors of emotions input

    let emotiveGenerator = new EmotiveGenerator();

    let emotionColors = []; // updated based on the text input about emotions


    // init the shader material of emotion ball

    let Mat_ball = new THREE.ShaderMaterial({
        vertexShader: vertex_emotionBall,
        fragmentShader: fragment_emotionBall,
        transparent: true,
        blending: THREE.LightenBlending,
        uniforms: {
            u_time: {
                value: 0
            },
            u_colorNum: {
                value: 1.
            },
            u_colors: {
                value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
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
                value: 1.0
            },

            u_amplitude: {
                value: 0.4
            },
            u_motionSpeed: {
                value: 0.8
            },
            u_edgeSmooth: {
                value: 0.8
            },
            u_glitchFrequency: {
                value: 1.4
            },
            u_glitchAmplitude: {
                value: 0.2
            }
        }
    })


    let bubbleGeometry = new THREE.SphereGeometry(1, 32, 32);

    function createTextTexture(text) {
        const textCanvas = document.createElement('canvas');
        textCanvas.height = 600;
        textCanvas.width = 600;

        const ctx = textCanvas.getContext('2d');

        ctx.font = '20px grobold';
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = 'white';

        let strArr = [];
        let maxLength = 35;
        for (let i = 0; i < text.length; i += maxLength) {
            strArr.push(text.slice(i, i + maxLength));
        }
        let lineHeight = 35;
        let totalHeight = strArr.length * lineHeight
        strArr.forEach((str, index) => {
            ctx.fillText(str, 0, textCanvas.height / 2 - totalHeight / 2 + index * 30);
        });



        const spriteMap = new THREE.Texture(ctx.getImageData(0, 0, textCanvas.width, textCanvas.height));
        spriteMap.minFilter = THREE.LinearFilter;
        spriteMap.generateMipmaps = false;
        spriteMap.needsUpdate = true;

        return spriteMap;
    }


    let Mat_bubble = new THREE.ShaderMaterial({
        vertexShader: vertex_textBubble,
        fragmentShader: fragment_textBubble,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.LightenBlending,
        uniforms: {
            u_time: {
                value: 0
            },
            u_scale: {
                value: 0.2
            },
            u_opacity: {
                value: 0.1
            },
            u_texture: {
                value: 0
            }

        }
    })




    function updateEmotionColor(input) {
        let emotions;
        if (input.indexOf(', ') > -1) {
            emotions = input.split(', ');
        } else if (input.indexOf(' ') > -1 && input.indexOf(',') == -1) {
            emotions = input.split(' ');
        } else {
            emotions = [`${this.inputBox.value}`, `${this.inputBox.value}`];
        }

        emotiveGenerator.setEmotion(emotions);
        emotionColors = emotiveGenerator.getColors();


        let num = emotions.length;

        Mat_human.uniforms.u_colorNum.value = num;
        Mat_human.uniforms.u_colors.value.splice(0, num, ...emotionColors);
        Mat_floor.uniforms.u_colors.value.splice(0, num, ...emotionColors);


        let humanColor = {
            contrast: Mat_human.uniforms.u_contrast.value,
            lightness: Mat_human.uniforms.u_lightness.value,
            saturation: 0.,
        }
        let tween_humanLightUp = new TWEEN.Tween(humanColor)
            .to({

                contrast: 1.,
                lightness: 1.4,
                saturation: 0.9,

            }, 2200)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {

                Mat_human.uniforms.u_contrast.value = humanColor.contrast;
                Mat_human.uniforms.u_lightness.value = humanColor.lightness;
                Mat_human.uniforms.u_saturation.value = humanColor.saturation;
                Mat_floor.uniforms.u_saturation.value = humanColor.saturation;

            }).start();

    }


    /*---------------------------------------  ANIMATION -------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/


    function generateBubble(text) {
        let tText = createTextTexture(text);

        Mat_bubble.uniforms.u_texture.value = tText;
        bubble = new THREE.Mesh(bubbleGeometry, Mat_bubble);

        let mat_t = new THREE.MeshPhongMaterial({
            specular: 0x111111,
            shininess: 1
        });

        let bubbleSettings = {
            x: -0.6,
            y: 0.9,
            z: -0.1,
        };


        let tween_bubbleApear = new TWEEN.Tween(bubbleSettings)
            .to({
                x: -0.5,
                y: 1.9,
                z: 0,
            }, 7500)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                bubble.position.set(bubbleSettings.x, bubbleSettings.y, bubbleSettings.z);

            }).start();

        let bubbleSettings2 = {
            scale: 0.2,
            opacity: 0.,
        }

        let tween_bubbleApear2 = new TWEEN.Tween(bubbleSettings2)
            .to({
                scale: 1,
                opacity: 1.,
            }, 7000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                Mat_bubble.uniforms.u_opacity.value = bubbleSettings2.opacity;
                bubble.scale.set(bubbleSettings2.scale, bubbleSettings2.scale, bubbleSettings2.scale);
            }).start();




        bubble.rotation.y = 0.8;
        scene.add(bubble);

    }

    let EMOTIVEPARAM = {};
    let gui;



    function generateEmotionBall(nameOfball) {

        // Create ball mesh. (Actually it is a plane but looks like a ball)

        let planeGeometry = new THREE.PlaneGeometry(3, 3);

        // Update shader materal

        EMOTIVEPARAM = emotiveGenerator.getUniforms();

        Mat_ball.uniforms.u_colorNum.value = EMOTIVEPARAM.colors.length;
        Mat_ball.uniforms.u_colors.value.splice(0, EMOTIVEPARAM.colors.length, ...EMOTIVEPARAM.colors);
        Mat_ball.uniforms.u_lightness.value = EMOTIVEPARAM.lightness;
        Mat_ball.uniforms.u_amplitude.value = EMOTIVEPARAM.amplitude;
        Mat_ball.uniforms.u_motionSpeed.value = EMOTIVEPARAM.motionSpeed;
        Mat_ball.uniforms.u_edgeSmooth.value = EMOTIVEPARAM.edgeSmooth;
        Mat_ball.uniforms.u_glitchFrequency.value = EMOTIVEPARAM.glitchFrequency;
        Mat_ball.uniforms.u_glitchAmplitude.value = EMOTIVEPARAM.glitchAmplitude;


        let ball = new THREE.Mesh(planeGeometry, Mat_ball);
        ball.position.set(1, 2, -1);

        let ballSettings = {
            x: 0,
            y: 0.3,
            z: -3,
            scale: 0,
            opacity: 0,
        }

        // Animation 1: emotion ball appear.  

        let tween_ballApear = new TWEEN.Tween(ballSettings)
            .to({
                x: 2.5,
                y: 1.6,
                z: 0,
                scale: 1,
                opacity: 0.9,
            }, 5000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                ball.position.set(ballSettings.x, ballSettings.y, ballSettings.z);
                ball.material.uniforms.u_opacity.value = ballSettings.opacity;

            }).start();

        scene.add(ball);


        // Animation 2: Merge the bubble and the ball

        let bubbleSettings = { // get the current properties og the bubble
            x: bubble.position.x,
            y: bubble.position.y,
            z: bubble.position.z,
            scale: bubble.scale,
            opacity: bubble.material.uniforms.u_opacity.value,
        };

        let tween_merge = new TWEEN.Tween(bubbleSettings)
            .to({
                x: 1.3,
                y: 1.2,
                z: 1.5,
                scale: 0.9, //???
                opacity: 0.02,
            }, 8000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                //??  bubble.scale.set(bubbleSettings.scale, bubbleSettings.scale, bubbleSettings.scale);

                bubble.position.set(bubbleSettings.x, bubbleSettings.y, bubbleSettings.z);
                bubble.material.uniforms.u_opacity.value = bubbleSettings.opacity;

            }).start();


        // Animation 3: Name tag appear after merging 

        let humanSettings = {
            lightness: human.material.uniforms.u_lightness.value,
            contrast: human.material.uniforms.u_contrast.value,
            saturation: 1.

        }
        let tween_humandark = new TWEEN.Tween(humanSettings)
            .to({
                lightness: 0.3,
                contrast: 1.1,
                saturation: 0.
            }, 3000)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(() => {
                Mat_human.uniforms.u_saturation.value = humanSettings.saturation;
                Mat_human.uniforms.u_lightness.value = humanSettings.lightness;
                Mat_human.uniforms.u_contrast.value = humanSettings.contrast;
                Mat_floor.uniforms.u_saturation.value = humanSettings.saturation;
            }).start();


        // Animation 4: Name tag appear after merging 

        generateNameTag(nameOfball);

        // Animation 5: 5s之后 小人消失，场景translate（情绪球移动到镜头之间）
        let animaSettings = {
            c_rotationY:control.rotationY,
        }
        // let tween_cameraRotate = new TWEEN.Tween(animaSettings)
        // .to({
        //     c_rotationY:0,

        // }, 3000)
        // .easing(TWEEN.Easing.Cubic.InOut)
        // .onUpdate(() => {
        //     control.rotationY = animaSettings.c_rotationY;
        // }).delay(5000).start();


        setTimeout(() => {
            closeUp(ball);
       }, 5000);


        setTimeout(() => {
            CreateGUI();
        }, 8000);







    }





    function CreateGUI() {
        const gui = new GUI()
        //   const folder = gui.addFolder('Cube')
        gui.add(EMOTIVEPARAM, 'lightness', 0., 1.)
        gui.add(EMOTIVEPARAM, 'amplitude', 0., 1.)
        gui.add(EMOTIVEPARAM, 'motionSpeed', 0., 1.)
        gui.add(EMOTIVEPARAM, 'edgeSmooth', 0., 1.)
        gui.add(EMOTIVEPARAM, 'glitchAmplitude', 0.0, 1.0)
        gui.add(EMOTIVEPARAM, 'glitchFrequency', 0., 5.)


    }


    function generateNameTag(nameTagString, font = Font, delay = 5000) {

        let settings = { // setting of the text
            x: 2.1,
            y: 0.8,
            z: 1.7,
            scale: 1.3,
            opacity: 0.02,
        }

        // Create material, geometry and mesh

        const color = new THREE.Color("rgb(255,255,255)");

        const mat_font = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.,
            side: THREE.DoubleSide
        });

        const fontShape = font.generateShapes(nameTagString, 0.1);
        const geometry = new THREE.ShapeGeometry(fontShape);
        geometry.computeBoundingBox();
        let width = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
        geometry.translate(-width / 2, 0, 0); // put the anchor at the center of the textShape 

        let textMesh = new THREE.Mesh(geometry, mat_font);
        textMesh.position.set(settings.x, settings.y, settings.z);
        scene.add(textMesh);

        // Set the animation

        let tween_NameTagAppear = new TWEEN.Tween(settings)
            .to({
                x: 2.1,
                y: 0.3,
                z: 1.7,
                scale: 1.8,
                opacity: 1.0,
            }, 2000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                mat_font.opacity = settings.opacity;
                let s = settings.scale;
                textMesh.scale.set(s, s, s);
                textMesh.position.y = settings.y;
            })
            .delay(delay).start();
    }


    /*---------------------------------------WINDOW RESIZE---------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }




    /*---------------------------------------INIT & UPDATE---------------------------------------*/
    /*--------------------------------------------------------------------------------------------*/

    let Font; // the font of the text in the scene

    function init() {
        const loader = new FontLoader();
        loader.load('https://threejs.org//examples/fonts/helvetiker_regular.typeface.json', (font) => {
            console.log("font is loaded");
            Font = font;
        })
        scene.translateX(1);

    }
    //update uniforms

    let start_time = Date.now();

    function update() {
        control.update(camera);

        Mat_human.uniforms.u_time.value = (Date.now() - start_time) * .001;

        Mat_bubble.uniforms.u_time.value = (Date.now() - start_time) * .0002;

        updateMatBallUniforms(EMOTIVEPARAM);

    }

    function updateMatBallUniforms(opt = {
        lightness: 1.,
        amplitude: 0.1,
        motionSpeed: 0.2,
        edgeSmooth: 0.6,
        glitchFrequency: 0.,
        glitchAmplitude: 0.
    }) {
        Mat_ball.uniforms.u_time.value = (Date.now() - start_time) * .001;
        Mat_ball.uniforms.u_lightness.value = opt.lightness;
        Mat_ball.uniforms.u_amplitude.value = opt.amplitude;
        Mat_ball.uniforms.u_motionSpeed.value = opt.motionSpeed;
        Mat_ball.uniforms.u_edgeSmooth.value = opt.edgeSmooth;
        Mat_ball.uniforms.u_glitchFrequency.value = opt.glitchFrequency;
        Mat_ball.uniforms.u_glitchAmplitude.value = opt.glitchAmplitude;
    }

    function getInputUnifroms() {
        return {
            lightness: EMOTIVEPARAM.lightness,
            amplitude: EMOTIVEPARAM.amplitude,
            motionSpeed: EMOTIVEPARAM.motionSpeed,
            edgeSmooth: EMOTIVEPARAM.edgeSmooth,
            glitchFrequency: EMOTIVEPARAM.glitchFrequency,
            glitchAmplitude: EMOTIVEPARAM.glitchAmplitude
        };
    }

    function closeUp(mesh){
        let target = new THREE.Vector3();
        target.addVectors(camera.position, new THREE.Vector3(0, 0, -10));

        let d = new THREE.Vector3();
        d.subVectors(target, mesh.position)

        //place the ball in front of the camera
        let sceneTranslate = {
            x: 0,
            y: 0,
            z: 0,
        };

        const tween_sceneTranslate = new TWEEN.Tween(sceneTranslate)
            .to({
                x: d.x,
                y: d.y,
                z: d.z,
            }, 8000)

            .easing(TWEEN.Easing.Cubic.Out)

            .onUpdate(() => {

               scene.position.x = sceneTranslate.x;
               scene.position.y = sceneTranslate.y;
               scene.position.z = sceneTranslate.z;
            })
            .start();


    }


    init();


    function hideGui() {
        GUI.toggleHide();
    }


    return {
        scene,
        camera,
        Mat_human,
        human,
        Mat_bubble,
        hideGui,
        update,
        generateEmotionBall,
        updateEmotionColor,
        generateBubble,
        getInputUnifroms,

        closeUp,

        onWindowResize
    };

}