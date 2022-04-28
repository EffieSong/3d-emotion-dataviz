import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Control from './components/controls/control'

import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'
const tHuman = require("./assets/textures/human.png")
import {
    vertex_human,
    fragment_human
} from './shaders/human/shader'
import {
    vertex_emotionBall,
    fragment_emotionBall
} from './shaders/emotionBall/shader'
import {
    vertex_textBubble,
    fragment_textBubble
} from './shaders/textBubble/shader'


export default () => {

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

    // LIGHTS

    let light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0.5, 0.5, 1);
    scene.add(light);

    let pointLight = new THREE.PointLight(0xff3300);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    let ambientLight = new THREE.AmbientLight(0x080808);
    scene.add(ambientLight);

    let control = new Control();
    control.farest = -2;


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
                value: 1
            },
            u_colors: {
                value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
            }
        }
    })
    let planeGeometry = new THREE.PlaneGeometry(5, 5);
    let human = new THREE.Mesh(planeGeometry, Mat_human);
    human.position.set(0, 0, -3);
    scene.add(human);

    let emotionColors = []; // updated based on the text input about emotions

    // Get coresponding colors from text input based on a defined rule (emotion wheel)

    function getEmotionColors(input, rule) {
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

    function updateEmotionColor(input, rule) {
        // emotionColors = [...getEmotionColors(input, rule)];
        emotionColors = [new THREE.Color("rgb(250,100,50)"), new THREE.Color("rgb(113,222,163)"), new THREE.Color("rgb(252,202,107)"), ]
        let num = emotionColors.length;

        Mat_human.uniforms.u_colors.value.splice(0, num, ...emotionColors);
        Mat_human.uniforms.u_colorNum.value = num;
    }

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
                value: 1
            },
            u_colors: {
                value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
            },
            u_opacity: {
                value: 0
            },
            u_saturation: {
                value: 1
            },
            u_scale: {
                value: 1.
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

        ctx.fillStyle = 'white';

        let strArr = [];
        let maxLength = 40;
        for (let i = 0; i < text.length; i += maxLength) {
            strArr.push(text.slice(i, i + maxLength));
        }
        let lineHeight = 30;
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

/*---------------------------------------  ANIMATION -------------------------------------*/
/*--------------------------------------------------------------------------------------------*/


    function generateBubble(text) {
        console.log(text);
        let tText = createTextTexture(text);

        //  let Mat_bubble2 = createBubbleMaterial(tText)
        Mat_bubble.uniforms.u_texture.value = tText;
        bubble = new THREE.Mesh(bubbleGeometry, Mat_bubble);
        // bubble = new THREE.(bubbleGeometry, newmaterials);

        let mat_t = new THREE.MeshPhongMaterial({
            specular: 0x111111,
            shininess: 1
        });

        let bubbleSettings = {
            x: 0.,
            y: 1.5,
            z: 0,
            scale: 0.2,
            opacity: 0.,
        };

        let tween_bubbleApear = new TWEEN.Tween(bubbleSettings)
            .to({
                x: 0.,
                y: 2.2,
                z: 0,
                scale: 1,
                opacity: 1.,
            }, 7000)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate(() => {
                bubble.position.set(bubbleSettings.x, bubbleSettings.y, bubbleSettings.z);
                Mat_bubble.uniforms.u_opacity.value = bubbleSettings.opacity;
                bubble.scale.set(bubbleSettings.scale, bubbleSettings.scale, bubbleSettings.scale);
            }).start();

        scene.add(bubble);

    }


    function generateEmotionBall(nameOfball) {

        // Create ball mesh. (Actually it is a plane but looks like a ball)

        let planeGeometry = new THREE.PlaneGeometry(3, 3);

        Mat_ball.uniforms.u_colorNum.value = emotionColors.length;
        Mat_ball.uniforms.u_colors.value.splice(0, emotionColors.length, ...emotionColors);

        let ball = new THREE.Mesh(planeGeometry, Mat_ball);
        ball.position.set(1, 2, -1);

        let ballSettings = {
            x: 0,
            y: 0.3,
            z: -3,
            scale: 0,
            opacity: 0,
            saturation: 1
        }
        
        // Animation 1: emotion ball appear.  

        let tween_ballApear = new TWEEN.Tween(ballSettings)
            .to({
                x: 2.5,
                y: 1.6,
                z: 0,
                scale: 1,
                opacity: 0.9,
                saturation: 0
            }, 5000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                ball.position.set(ballSettings.x, ballSettings.y, ballSettings.z);
                ball.material.uniforms.u_opacity.value = ballSettings.opacity;
                Mat_human.uniforms.u_saturation.value = ballSettings.saturation;

            }).start();

            scene.add(ball);


        // Animation 2: Merge the bubble and the ball

        let bubbleSettings = {  // get the current properties og the bubble
            x: bubble.position.x,
            y: bubble.position.y,
            z: bubble.position.z,
            scale: bubble.scale,
            opacity: bubble.material.uniforms.u_opacity.value,
        };

        let tween_merge = new TWEEN.Tween(bubbleSettings)
            .to({
                x: 2.3,
                y: 1.6,
                z: 1.5,
                scale: 1,
                opacity: 0.02,
            }, 8000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onUpdate(() => {
                bubble.position.set(bubbleSettings.x, bubbleSettings.y, bubbleSettings.z);
                bubble.material.uniforms.u_opacity.value = bubbleSettings.opacity;
            }).start();


        // Animation 3: Name tag appear after merging 

        generateNameTag(nameOfball);

    }


    function generateNameTag(nameTagString, font = Font, delay = 5000) {

        let settings = { // setting of the text
            x: 2.3,
            y: 0.9,
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
                x: 2.3,
                y: 0.6,
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

    }
    //update uniforms

    let start_time = Date.now();

    function update() {
            control.update(camera);
            Mat_bubble.uniforms.u_time.value = (Date.now() - start_time) * .0002;
            Mat_ball.uniforms.u_time.value = (Date.now() - start_time) * .001;
            Mat_human.uniforms.u_time.value = (Date.now() - start_time) * .001;
    }
    

    init();










    return {
        scene,
        camera,
        Mat_human,
        Mat_bubble,
        update,
        generateEmotionBall,
        updateEmotionColor,
        generateBubble,

        onWindowResize
    };

}