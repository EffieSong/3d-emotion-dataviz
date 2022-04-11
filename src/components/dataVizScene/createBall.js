//Create visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.
//Add interaction logic for each visual representation of the data

import * as THREE from 'three';


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
    // let ballParams = {
    //     colMix: 0.9
    // }

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


    // placement X
    plane.position.x = diaryObj.eventTypeIndex * colSpace;

    // placement Y
    plane.position.y = Math.random() * 2.5+0.5;

    // placement Z
    plane.position.z = -diaryObj.index * rowSpace;


    // Add interaction 
    interactionManager.add(plane);
    plane.addEventListener("click", (event) => {
        console.log( event.target.emotionInfo );
    });
    plane.addEventListener("mouseover", (event) => {
        //  event.target.material.color.set(0xff0000);
        document.body.style.cursor = "pointer";
        event.target.scale.set(1.5, 1.5, 1.5);

    });
    plane.addEventListener("mouseout", (event) => {
        document.body.style.cursor = "default";
        event.target.scale.set(1., 1., 1.);

    });

    return plane;
}