//Object generated from the pure diary data
import {
  RULE
} from '../UI/scriptableObj';

export default class DiaryObj {

  // _relatedLines: THREE.Line[] = []; //we store curves in object so we can remove them from the scene when event dismissed

  constructor(opt) {
    this.id = opt.id;
    this.time = opt.time;
    this.type = opt.type;
    this.relatedEvent = opt.relatedEvent;
    this.emotions = opt.emotions;
    this.event = opt.event;
    this.thoughts = opt.thoughts;
    this.bodyReaction = opt.bodyReaction;
    this.nameOfFeelings = opt.nameOfFeelings;

    this.emotionColors = [...this.getEmotionColors(opt.emotions, RULE)];
  };

  getEmotionColors(input, rule) {
    let colors = [];
    this.emotions.forEach(emo => {
      let color = rule.find(item => {
        return item.emotion == emo;
      }).color;
      colors.push(color);
    });

    //把colors[] 填充到5个color  uniform vec3 u_colors[ 5 ];

    for(let i=0;i< 5 - this.emotions.length;i++){
       colors.push(colors[1]);
    }

    return colors;
  }
}