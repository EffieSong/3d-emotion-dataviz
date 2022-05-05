import {
    EMOTIONMATRIX
} from './UI/scriptableObj'


//input: ["emotmion1","emotion2","emotion3"]
// //output:  {
//         colors: [color1, color2, color3],
//         lightness: ,
//         amplitude: ,
//         motionSpeed:,
//         edgeSmooth:,
//         glitchFrequency: ,
//         glitchAmplitude:
//     }

export default class EmotiveGenerator {
    constructor() {
        this.emtion = 1;
    }

    setEmotion(arrOfEmotionsString) { //input from emotion wheel, return an emotion
        this.emotions = [...arrOfEmotionsString];
    }

    //get an array of objs which contains data of emotion from the EMOTIONMATRIX

    getEmotionDataObjArr(rule) {

        let arr = [];

        this.emotions.forEach((emo) => {

            let emotionDataObj = rule.find(item => {
                return item.emotion == emo;
            });

            arr.push(emotionDataObj);
        });

        console.log("getEmotionDataObjArr:", arr);

        return arr;
    }


    // Get coresponding colors from text input based on a defined rule (emotion wheel)

    getColors(arrOfEmotionsString) {

        let colors = [];

        arrOfEmotionsString.forEach(emo => {

            let color = EMOTIONMATRIX.find(item => {
                return item.emotion == emo;
            }).color;

            colors.push(color);
        });

        return colors;
    }



    // compute factors of uniforms with the input of multi emotions
    getUniforms() {

        let emotions = [...this.getEmotionDataObjArr(EMOTIONMATRIX)];

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
            console.log(curr);

            pre += curr[calculatedProperty];

            return pre;

        }, 0);

        return sum / array.length
    };

}