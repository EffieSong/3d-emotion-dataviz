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
    }
];

let PROMPTS = [
    "What happened to me that comes to my mind is:",
    "​​The key words of my emotions are:",
    "I noticed that body reacts like that:",
    "I noticed that I had these thoughts/picture in my mind that said:",
    "For these experiences from my mind and body, I want to give them a name:",
    "That way I'll recognize it faster the next time it comes to me."
]

export {RULE,PROMPTS} 