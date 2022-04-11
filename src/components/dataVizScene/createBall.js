//Create visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.

import * as THREE from 'three';

import {
    vertex_emotionBall,
    fragment_emotionBall
} from '../../shaders/emotionBall/shader'

export default (
    diaryObj,// :DiaryObj
    colSpace, // :number
    rowSpace // :number
) => {
    // let ballParams = {
    //     colMix: 0.9
    // }

    let relativeScale =2;
    let planeWidth = relativeScale*colSpace;

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
            u_colors:{
                value:[...diaryObj.emotionColors]
            }
        }
    })

    let plane = new THREE.Mesh(planeGeometry, Mat);

    //placement X
    plane.position.x = diaryObj.eventTypeIndex*colSpace;
  //  plane.position.x -= planeWidth/2;

    //placement Y
    plane.position.y = Math.random()*3;

    //placement Z
    plane.position.z = -diaryObj.index*rowSpace;

    return plane;
}