import * as THREE from 'three'



let EMOTIONMATRIX = [{ ////
        emotion: "joy",
        color: new THREE.Color("rgb(249,200,108)"),
        lightness: 1.,
        amplitude: 0.2,
        motionSpeed: 0.3,
        edgeSmooth: 0.8,
        glitchFrequency: 0.,
        glitchAmplitude: 0.
    },
    { ///
        emotion: "trust",
        color: new THREE.Color("rgb(179,208,119)"),
        lightness: 1.,
        amplitude: 0.1,
        motionSpeed: 0.2,
        edgeSmooth: 0.6,
        glitchFrequency: 0.,
        glitchAmplitude: 0.
    },
    {
        emotion: "anticipation",
        color: new THREE.Color("rgb(233,150,79)"),
        lightness: 1.,
        amplitude: 0.1,
        motionSpeed: 0.2,
        edgeSmooth: 0.8,
        glitchFrequency: 0.,
        glitchAmplitude: 0.
    },
    { ///
        emotion: "sadness",
        color: new THREE.Color("rgb(66,130,192)"),
        lightness: 1.,
        amplitude: 0.5,
        motionSpeed: 0.08,
        edgeSmooth: 1.,
        glitchFrequency: 3.,
        glitchAmplitude: 0.3
    },
    { ///
        emotion: "disgust",
        color: new THREE.Color("rgb(141,91,153)"),
        lightness: 1.,
        amplitude: 0.3,
        motionSpeed: 0.35,
        edgeSmooth: 1.,
        glitchFrequency: 3.4,
        glitchAmplitude: 0.3
    },
    {
        emotion: "anger",
        color: new THREE.Color("rgb(221,80,72)"),
        lightness: 1.2,
        amplitude: 0.4,
        motionSpeed: 0.55,
        edgeSmooth: 0.7,
        glitchFrequency: 2.,
        glitchAmplitude: 0.1
    },
    {
        emotion: "fear",

        color: new THREE.Color("rgb(87,161,102)"),
        lightness: 1.,
        amplitude: 0.1,
        motionSpeed: 0.6,
        edgeSmooth: 0.7,
        glitchFrequency: 5.,
        glitchAmplitude: 0.1
    },
    {
        emotion: "surprise",
        color: new THREE.Color("rgb(89,173,211)"),
        lightness: 1.2,
        amplitude: 0.4,
        motionSpeed: 0.3,
        edgeSmooth: 0.6,
        glitchFrequency: 0.,
        glitchAmplitude: 0.0
    }

]



let PROMPTS = [
    "What happened to me that comes to my mind is:",
    "​​The key words of my emotions are (I feel...):",
    "I noticed that body reacts like that:",
    "I noticed that I had these thoughts/picture in my mind that said:",
    "For these experiences from my mind and body, I want to give them a name:",
    "That way I'll recognize it faster the next time it comes to me."
]

export {
    PROMPTS,
    EMOTIONMATRIX
}