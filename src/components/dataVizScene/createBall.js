//Create visualized object of each diary data in 3d space. 
//Place it in the 3d world based on the data.

import * as THREE from 'three';
import DiaryObj from "../diaryData/diaryObj";

import {
    vertex_emotionBall,
    fragment_emotionBall
} from '../../shaders/emotionBall/shader'

export default () => {
    let ballParams = {
        colMix: 0.9
    }

    let planeGeometry = new THREE.PlaneGeometry(3, 3);
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

    let plane = new THREE.Mesh(planeGeometry, Mat);

    //placement X
    plane.position.x = 1;

    //placement Y
    plane.position.y = 2;

    //placement Z
    plane.position.z = -2;

    return plane;
}