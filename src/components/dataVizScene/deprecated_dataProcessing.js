import * as THREE from 'three';
import DiaryObj from "../diaryData/diaryObj";
import EmotionBall from './emotionBall';


import {
    FEELINGDATA
} from '../diaryData/FEELINGDATA'
import buildWorld from './buildWorld'


export default (
    dataViz, // :DataViz
    scene, // :THREE.Scene
    camera, // :THREE.Camera
    interactionManager, //:InteractionManager
) => {
    const diaryObjs = [];
    // FETCH DATA

    // PROCESS DATA

    // create an object for each diary
    FEELINGDATA.forEach((diary, index) => {
        let diaryObj = new DiaryObj({
            time: diary.time,
            type: diary.type,
            relatedEvent: diary.relatedEvent,
            emotions: diary.emotions,
            event: diary.event,
            thoughts: diary.thoughts,
            bodyReaction: diary.bodyReaction,
            nameOfFeelings: diary.nameOfFeelings,
        })
        diaryObj.index = index; // add index to each diary object
        diaryObj.eventTypeIndex = dataViz.eventTypes.indexOf(diary.type); // add index of event types, which is used to compute the placement X.
        diaryObjs.push(diaryObj);
    });



    //BUILD WORLD
    buildWorld(
        dataViz, // DataViz,
        scene, // THREE.Scene,
        2, //number,
        3,
    );

    //CREATE BALL
    let emotionBalls = [];
    diaryObjs.forEach(item => {
        let emotionBall = new EmotionBall({
            diaryObj: item,
            colSpace: dataViz.colSpace,
            rowSpace: dataViz.colSpace,
            interactionManager: interactionManager,
            scene: scene,
            camera:camera,
            offsetX: -dataViz.colSpace * (dataViz.bars - 1) / 2 // translate all the balls as a group to place this group at the center
        });
        emotionBalls.push(emotionBall);
        emotionBall.balls = emotionBalls;
    
    });
    return emotionBalls;
}