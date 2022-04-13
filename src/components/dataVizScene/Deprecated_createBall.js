//Create visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.
//Add interaction logic for each visual representation of the data

import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js'
import {
    vertex_emotionBall,
    fragment_emotionBall
} from '../../shaders/emotionBall/shader'

export default (
    diaryObj, // :DiaryObj
    colSpace, // :number
    rowSpace, // :number
    interactionManager, //:InteractionManager
) => {


    let relativeScale = 1;
    let planeWidth = relativeScale * colSpace;
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
                value: diaryObj.emotions.length
            },
            u_colors: {
                value: [...diaryObj.emotionColors]
            }
        }
    })

    let plane = new THREE.Mesh(planeGeometry, Mat);
    plane.emotionInfo = diaryObj.emotions; // Add information to the plane


    // Compute placement X, Y, Z

    plane.position.x = diaryObj.eventTypeIndex * colSpace;
    plane.position.y = Math.random() * 2.5 + 0.5;
    plane.position.z = -diaryObj.index * rowSpace;

    // Set animation

    let transform = {
        scale: 1
    }

    const tween1 = new TWEEN.Tween(transform)  // scale up
        .to({
            scale: 2.
        }, 400)
        .easing(TWEEN.Easing.Quadratic.Out);
    const tween2 = new TWEEN.Tween(transform)   // scale down
        .to({
            scale: 1
        }, 300)
        .easing(TWEEN.Easing.Quadratic.Out);



    // Add interaction and animation
    
    interactionManager.add(plane);
    plane.addEventListener("click", (event) => {
        console.log(event.target.emotionInfo);
    });
    plane.addEventListener("mouseover", (event) => {
        document.body.style.cursor = "pointer";
        let s = event.target.scale;
        transform.scale = s.x;
        tween1.onUpdate(() => {
            s.set(transform.scale, transform.scale, transform.scale);
        });
        tween1.start();
    });

    plane.addEventListener("mouseout", (event) => {
        document.body.style.cursor = "default";
        let s = event.target.scale;
        tween2.onUpdate(() => {
            s.set(transform.scale, transform.scale, transform.scale);
        });
        tween1.stop();
        tween2.start();
    });

    
    let dataVisualGroup = new THREE.Group();
    dataVisualGroup.add(plane);

    return plane;
}