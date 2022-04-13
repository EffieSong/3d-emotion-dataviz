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
    interactionManager, //:InteractionManager
) => {
    const diaryObjs = [];
    console.log("dataProcessing");

    // FETCH DATA

    // PROCESS DATA

    //create an object for each diary
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
    let ballsGroup = new THREE.Group();

    // diaryObjs.forEach(item => {
    //     let emotionBall = createBall(
    //         item,
    //         dataViz.colSpace,
    //         dataViz.rowSpace,
    //         interactionManager
    //     );
    //     emotionBall.randomValue = 10 * Math.random(); // add a randomValue parameters to each data, which is used in updating uniforms
    //     emotionBalls.push(emotionBall);
    //     ballsGroup.add(emotionBall);
    // });
    // ballsGroup.position.x -= dataViz.colSpace * (dataViz.bars - 1) / 2; // translate all the balls as a group to place this group at the center
    // scene.add(ballsGroup);

    diaryObjs.forEach(item => {
        let emotionBall = new EmotionBall({
            diaryObj: item,
            colSpace: dataViz.colSpace,
            rowSpace: dataViz.colSpace,
            interactionManager: interactionManager,
            scene: scene,
        });
        ballsGroup.add(emotionBall.ballMesh);
        emotionBalls.push(emotionBall);
    });
    ballsGroup.position.x -= dataViz.colSpace * (dataViz.bars - 1) / 2; // translate all the balls as a group to place this group at the center
    scene.add(ballsGroup);

    return emotionBalls;
}