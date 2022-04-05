import DiaryObj from "../diaryData/diaryObj";

import {
    FEELINGDATA
} from '../diaryData/FEELINGDATA'
import buildWorld from './buildWorld'


export default () => {
    let diaryObjs =[];
    console.log("dataProcessing");

    // FETCH DATA

    // PRCESS DATA

    //create an object for each diary
    FEELINGDATA.forEach((diary) => {
        let diaryObj = new DiaryObj(
            diary.time,
            diary.type,
            diary.relatedEvent,
            diary.emotions,
            diary.event,
            diary.thoughts,
            diary.bodyReaction,
            diary.nameOfFeelings,

        )
        diaryObjs.push(diaryObj);

    });

   //BUILD WORLD
    buildWorld();
  


}