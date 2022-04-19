import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Control from './components/controls/control'


const tHuman = require("./assets/textures/human.png")
import {
    vertex_human,
    fragment_human
} from './shaders/human/shader'
import {
    vertex_emotionBall,
    fragment_emotionBall
} from './shaders/emotionBall/shader'

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
    scene.background = new THREE.Color(0x0B0C24);
    let control = new Control();
    control.farest = -2;


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
            u_saturation:{
                value: 1
            },
            u_colors: {
                value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
            }
        }
    })
    let planeGeometry = new THREE.PlaneGeometry(3, 3);
    let human = new THREE.Mesh(planeGeometry, Mat_human);
    human.position.set(0, 0, -3);
    scene.add(human);


    //set up animation

    let ballSettings = {
        x: 0,
        y: 0,
        z: -3,
        scale: 0,
        opacity: 0,
        saturation:1
    }
    let tween_ballApear = new TWEEN.Tween(ballSettings)
        .to({
            x: 2,
            y: 0.5,
            z: 0,
            scale: 1,
            opacity: 0.9,
            saturation:0
        }, 5000)
        .easing(TWEEN.Easing.Cubic.InOut);


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
        emotionColors = [...getEmotionColors(input, rule)];
        let num = emotionColors.length;

        Mat_human.uniforms.u_colors.value.splice(0, num, ...emotionColors);
        Mat_human.uniforms.u_colorNum.value = num;
    }

    // Create emotion ball material

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


    function generateEmotionBall() {
        let planeGeometry = new THREE.PlaneGeometry(3, 3);

        Mat_ball.uniforms.u_colorNum.value = emotionColors.length;
        Mat_ball.uniforms.u_colors.value.splice(0, emotionColors.length, ...emotionColors);

        let ball = new THREE.Mesh(planeGeometry, Mat_ball);
        ball.position.set(1, 1, -1);

        tween_ballApear.onUpdate(() => {
            ball.position.set(ballSettings.x, ballSettings.y, ballSettings.z);
            ball.material.uniforms.u_opacity.value = ballSettings.opacity;
            Mat_human.uniforms.u_saturation.value = ballSettings.saturation;

        }).start();

        scene.add(ball);

        // Update Mat_human

    }


    //update uniforms

    let start_time = Date.now();
    let update = function () {
        control.update(camera);

        Mat_ball.uniforms.u_time.value = (Date.now() - start_time) * .001;
        Mat_human.uniforms.u_time.value = (Date.now() - start_time) * .001;
    }


    return {
        scene,
        camera,
        Mat_human,
        update,
        generateEmotionBall,
        updateEmotionColor
    };

}