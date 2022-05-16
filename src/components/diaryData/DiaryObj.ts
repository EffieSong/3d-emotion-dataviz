//Object generated from the pure diary data
import {
  EMOTIONMATRIX
} from '../UI/scriptableObj'
import EmotiveGenerator from '../EmotiveGenerator';

export default class DiaryObj {

  // _relatedLines: THREE.Line[] = []; //we store curves in object so we can remove them from the scene when event dismissed

  constructor(opt) {
    this.generator = new EmotiveGenerator();
    this.id = opt.id;
    this.time = opt.time;
    this.type = opt.type;
    this.relatedEvent = opt.relatedEvent;
    this.emotions = opt.emotions; //:array of strings
    this.event = opt.event;
    this.thoughts = opt.thoughts;
    this.bodyReaction = opt.bodyReaction;
    this.nameOfFeelings = opt.nameOfFeelings;

    this.generator.setEmotion(opt.emotions);

   // computed parameters
  
   this.emotionColors = [...this.generator.getColors()];

   // this.emotionColors = [...this.getEmotionColors(opt.emotions, EMOTIONMATRIX)];
    this.emotionDataObjArr = [...this.getEmotionDataObjArr(EMOTIONMATRIX)];
  
  };

  // getEmotionColors(input, rule) {
  //   //this.generator.getColors();


  //   let colors = [];
    
  //   console.log(this.emotions);

  //   this.emotions.forEach(emo => {
  //     let color = rule.find(item => {
  //       return item.emotion == emo;
  //     }).color;
  //   });

  //   //把colors[] 填充到5个color  uniform vec3 u_colors[ 5 ];

  //   for(let i=0;i< 5 - this.emotions.length;i++){
  //      colors.push(colors[1]);
  //   }

  //   return colors;
  // }

  //get an array of objs which contains data of emotion from the EMOTIONMATRIX
  
  getEmotionDataObjArr(rule){
    let arr = [];
    this.emotions.forEach((emo)=>{
      let emotionDataObj = rule.find(item => {
        return item.emotion == emo;
      });
      arr.push(emotionDataObj);
    });
    return arr;
  }

 }