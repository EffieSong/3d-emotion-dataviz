//Create visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.

import * as THREE from 'three';
import DiaryObj from "../diaryData/diaryObj";

import {
    vertex_emotionBall,
    fragment_emotionBall
} from '../../shaders/emotionBall/shader'

export default (
    diaryObj,// :DiaryObj
    colSpace, // :number
    rowSpace // :number
) => {
    let ballParams = {
        colMix: 0.9
    }
    let relativeScale =1;
    let planeWidth = relativeScale*colSpace;

    let planeGeometry = new THREE.PlaneGeometry(planeWidth, planeWidth);
    let Mat = new THREE.ShaderMaterial({
        vertexShader: vertex_emotionBall,
        fragmentShader: fragment_emotionBall,
        transparent: true,
        blending: THREE.LightenBlending,
        uniforms: {
            uTime: {
                value: 0
            },
            diffuse: {
                value: new THREE.Color('white')
            },
            fresnelColor: {
                value: new THREE.Color('yellow')
            },
            uColMix: {
                value: ballParams.colMix
            },
            uFrequency: {
                value: 0.
            },
        }
    })
    let matTest = new THREE.MeshBasicMaterial();

    let plane = new THREE.Mesh(planeGeometry, Mat);

    //placement X
    plane.position.x = diaryObj.eventTypeIndex*colSpace;
    plane.position.x -= planeWidth/2;
    //placement Y
    plane.position.y = Math.random()*5;

    //placement Z
    plane.position.z = -diaryObj.index*rowSpace;

    return plane;
}