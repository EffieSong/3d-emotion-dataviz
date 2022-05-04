import * as THREE from 'three'



let EMOTIONMATRIX = [{ ////
        emotion: "joy",
        color: new THREE.Color("rgb(250,220,137)"),
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
        color: new THREE.Color("rgb(239,175,114)"),
        lightness: 1.,
        amplitude: 0.1,
        motionSpeed: 0.2,
        edgeSmooth: 0.8,
        glitchFrequency: 0.,
        glitchAmplitude: 0.
    },
    { ///
        emotion: "sadness",
        color: new THREE.Color("rgb(126,168,214)"),
        lightness: 1.,
        amplitude: 0.5,
        motionSpeed: 0.08,
        edgeSmooth: 1.3,
        glitchFrequency: 2.3,
        glitchAmplitude: 0.5
    },
    { ///
        emotion: "disgust",
        color: new THREE.Color("rgb(160,146,192)"),
        lightness: 1.,
        amplitude: 0.3,
        motionSpeed: 0.35,
        edgeSmooth: 0.8,
        glitchFrequency: 0.,
        glitchAmplitude: 0.0
    },
    {
        emotion: "anger",
        color: new THREE.Color("rgb(226,122,114)"),
        lightness: 1.2,
        amplitude: 0.4,
        motionSpeed: 0.55,
        edgeSmooth: 0.7,
        glitchFrequency: 0.,
        glitchAmplitude: 0.0
    },
    {
        emotion: "fear",

        color: new THREE.Color("rgb(92,177,122)"),
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
    "​​The key words of my emotions are:",
    "I noticed that body reacts like that:",
    "I noticed that I had these thoughts/picture in my mind that said:",
    "For these experiences from my mind and body, I want to give them a name:",
    "That way I'll recognize it faster the next time it comes to me."
]

export {
    PROMPTS,
    EMOTIONMATRIX
}