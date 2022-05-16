/* Generate object of uniforms used for shader materials
 from an array of strings (about emotions) and a given rule 

input: ["emotmion1","emotion2","emotion3"]
output: {
        colors: [color1, color2, color3],
        lightness: ,
        amplitude: ,
        motionSpeed:,
        edgeSmooth:,
        glitchFrequency: ,
        glitchAmplitude:
          }*/

import {
    EMOTIONMATRIX
} from './UI/scriptableObj'


export default class EmotiveGenerator {
    constructor() {
        this.emotions = ['joy'];
    }

    setEmotion(arrOfEmotionsString) { //input from emotion wheel, return an emotion
        this.emotions.length = 0;
        this.emotions = arrOfEmotionsString.map(item=>this.classifyEmotion(item));
        return  this.emotions;
        // this.emotions = [...arrOfEmotionsString()];
    }

    classifyEmotion(emoString) {
        let classifiedEmo = "joy";

        if (emoString == "grateful" ||emoString == "accepted" ||emoString == "hopeful" ||emoString == "peaceful" ||emoString== "trust") {classifiedEmo = "trust"}
        else if (emoString == "optimistic" ||emoString == "confident" ||emoString == "joyful" ||emoString == "loving"||emoString =="happy" ||emoString=="joy") {classifiedEmo = "joy"}
        else if (emoString == "cautions" ||emoString == "weak" ||emoString == "anxious" ||emoString == "scared"||emoString =="nervous"||emoString =="worried"||emoString == "fear" ) {classifiedEmo = "fear"}
        else if (emoString == "ashamed" ||emoString == "lonely" ||emoString == "hurt" ||emoString == "depressed"||emoString =="sad" ||emoString == "sadness" ) {classifiedEmo = "sadness"}
        else if (emoString == "contempt" ||emoString == "repelled" ||emoString == "dislike" ||emoString == "disapproval" ||emoString == "disgust" ) {classifiedEmo = "disgust"}
        else if (emoString == "critical" ||emoString == "aggressive" ||emoString == "frustrated" ||emoString == "insulted"||emoString =="angry"||emoString =="anger") {classifiedEmo = "anger"}
        else if (emoString == "disappointed" ||emoString == "amazed" ||emoString == "confused" ||emoString == "startied"||emoString =="surprise") {classifiedEmo = "surprise"}
        else if (emoString == "stressed" ||emoString == "interested" ||emoString == "eager" ||emoString == "excited"||emoString =="anticipation") {classifiedEmo = "anticipation"}
        return classifiedEmo
    }

    //get an array of objs which contains data of emotion from the EMOTIONMATRIX


    getEmotionDataObjArr(arrOfEmotionsString = this.emotions, rule) {

        let arr = [];

        arrOfEmotionsString.forEach((emo) => {

            let emotionDataObj = rule.find(item => {
                return item.emotion == emo;
            });

            arr.push(emotionDataObj);
        });

        return arr;
    }


    // Get coresponding colors from text input based on a defined rule (emotion wheel)

    getColors(arrOfEmotionsString = this.emotions) {

        let colors = [];

        arrOfEmotionsString.forEach(emo => {

            let color = EMOTIONMATRIX.find(item => {
                return item.emotion == emo;
            }).color;

            colors.push(color);
        });

        //把colors[] 填充到5个color  uniform vec3 u_colors[ 5 ];

        for (let i = 0; i < 5 - this.emotions.length; i++) {
            colors.push(colors[1]);
        }

        return colors;
    }



    // compute factors of uniforms with the input of multi emotions
    getUniforms(arrOfEmotionsString = this.emotions) {

        let emotions = [...this.getEmotionDataObjArr(arrOfEmotionsString, EMOTIONMATRIX)];

        return {
            colors: [...this.getColors()],
            lightness: this.calculateAverage(emotions, "lightness"),
            amplitude: this.calculateAverage(emotions, "amplitude"),
            motionSpeed: this.calculateAverage(emotions, "motionSpeed"),
            edgeSmooth: this.calculateAverage(emotions, "edgeSmooth"),
            glitchFrequency: this.calculateAverage(emotions, "glitchFrequency"),
            glitchAmplitude: this.calculateAverage(emotions, "glitchAmplitude")
        }
    }

    // calculate the average amount of multi-emotions
    calculateAverage(array, calculatedProperty) { // sumProperty: string

        let sum = array.reduce(function (pre, curr) {

            pre += curr[calculatedProperty];

            return pre;

        }, 0);

        return sum / array.length
    };

}