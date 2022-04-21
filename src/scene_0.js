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
import {
    vertex_textBubble,
    fragment_textBubble
} from './shaders/textBubble/shader'
import {
    FresnelShader
} from './shaders/textBubble/FresnelShader'
import {
    extendMaterial
} from './shaders/ExtendMaterial'

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
   // ambient light
   scene.add( new THREE.AmbientLight( 0x222222 ) );
    
   // directional light
   var light = new THREE.DirectionalLight( 0xffffff, 1 );
   light.position.set( 80, 80, 80 );
   scene.add( light );

    let control = new Control();
    control.farest = -2;


    /*---------------------------------------ADD HUMAN MESH---------------------------------------*/
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


    //set up animation

    let ballSettings = {
        x: 0,
        y: 0.3,
        z: -3,
        scale: 0,
        opacity: 0,
        saturation: 1
    }
    let tween_ballApear = new TWEEN.Tween(ballSettings)
        .to({
            x: 2.5,
            y: 1.6,
            z: 0,
            scale: 1,
            opacity: 0.9,
            saturation: 0
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

    // Create thoughts bubble geometry
    let bubbleGeometry = new THREE.SphereGeometry(2, 32, 32);
    // let bubbleGeometry = new THREE.PlaneGeometry(3, 3);


    // Create thoughts bubble texture


    function createTextTexture(text) {
        const textCanvas = document.createElement('canvas');
        textCanvas.height = 400;
        textCanvas.width = 400;

        const ctx = textCanvas.getContext('2d');

        ctx.font = '24px grobold';
        ctx.textBaseline = "middle";
        //	ctx.fillStyle = 'gray';
        // ctx.fillRect(0, 0, textCanvas.width, textCanvas.height);
        ctx.fillStyle = 'white';
        ctx.fillText(text, 0, textCanvas.height / 2);


        const spriteMap = new THREE.Texture(ctx.getImageData(0, 0, textCanvas.width, textCanvas.height));
        spriteMap.minFilter = THREE.LinearFilter;
        spriteMap.generateMipmaps = false;
        spriteMap.needsUpdate = true;

        return spriteMap;
    }

    let thoughtsString = "I can't have fun with friends right now . I need to focus on something more important, or I won’t find my job and I won't be able to stay in New York."
    let texture = createTextTexture(thoughtsString);


    // Create thoughts bubble material

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
            u_texture: {
                value: texture
            }

        }
    })



    let bubble = new THREE.Mesh(bubbleGeometry, Mat_bubble);
    bubble.position.set(0, 2.2, 0);
    scene.add(bubble);

    console.log(bubbleGeometry);





    function generateEmotionBall() {
        let planeGeometry = new THREE.PlaneGeometry(3, 3);

        Mat_ball.uniforms.u_colorNum.value = emotionColors.length;
        Mat_ball.uniforms.u_colors.value.splice(0, emotionColors.length, ...emotionColors);

        let ball = new THREE.Mesh(planeGeometry, Mat_ball);
        ball.position.set(1, 2, -1);

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
        Mat_bubble.uniforms.u_time.value = (Date.now() - start_time) * .0002;
        Mat_ball.uniforms.u_time.value = (Date.now() - start_time) * .001;
        Mat_human.uniforms.u_time.value = (Date.now() - start_time) * .001;
    }


    return {
        scene,
        camera,
        Mat_human,
        Mat_bubble,
        update,
        generateEmotionBall,
        updateEmotionColor
    };

}