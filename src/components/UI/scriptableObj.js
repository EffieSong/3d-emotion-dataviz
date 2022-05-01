import * as THREE from 'three'


let RULE = [{
        emotion: "joy",
        color: new THREE.Color("rgb(252,202,107)")

    },
    {
        emotion: "trust",
        color: new THREE.Color("rgb(113,222,163)")
    },
    {
        emotion: "love",
        color: new THREE.Color("rgb(250,100,50)")
    },


];
let matrix ={
    "joy":{
        color:new THREE.Color("hsl(44%, 45%, 98%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },
    "trust":{
        color:new THREE.Color("hsl(80%, 43%, 82%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },
    "anticipation":{
        color:new THREE.Color("hsl(29%, 52%, 94%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },
    "sadness":{
        color:new THREE.Color("hsl(211%, 41%, 84%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.5,
        glitchFrequency:1.,
        glitchAmplitude:1.
    },
    "disgust":{
        color:new THREE.Color("hsl(258%, 24%, 75%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },
    "anger":{
        color:new THREE.Color("hsl(4%, 50%, 89%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },
    "fear":{
        color:new THREE.Color("hsl(141%, 48%, 69%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },
    "surprise":{
        color:new THREE.Color("hsl(199%, 58%, 83%)"),
        frequency:1.,
        amplitude:1.,
        motionSpeed:1.,
        edgeSmooth:0.1,
        glitchFrequency:0.,
        glitchAmplitude:0.
    },

}
 


let PROMPTS = [
    "What happened to me that comes to my mind is:",
    "​​The key words of my emotions are:",
    "I noticed that body reacts like that:",
    "I noticed that I had these thoughts/picture in my mind that said:",
    "For these experiences from my mind and body, I want to give them a name:",
    "That way I'll recognize it faster the next time it comes to me."
]

export {RULE,PROMPTS} 