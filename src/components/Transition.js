import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

/**
 * @param {scene_0} sceneA //object with {scene, camera, update}
 * @param {scene_1} sceneB //object with {scene, camera, update}

 * @param {THREE.renderer} renderer
 */

//https://threejs.org/examples/webgl_postprocessing_crossfade.html

export default class Transition {
    constructor(renderer, sceneA, sceneB) {
        this.transitionParams = {
            "useTexture": true,
            "transition": 0.,
            "transitionSpeed": 1.2,
            "texture": 1,
            "loopTexture": false,
            "animateTransition": false,
            "textureThreshold": 1.0
        };
        this.transitValue = {
            value: 0
        }

        this.tween_transit = new TWEEN.Tween(this.transitValue)
            .to({
                value: 1
            }, 3000/this.transitionParams.transitionSpeed)
            .easing(TWEEN.Easing.Linear.None).onUpdate(() => {
                this.transitionParams.transition = this.transitValue.value
            }).onComplete(()=>{
                this.transitionParams.animateTransition  =false;
                this.transitionParams.transition =1.
            });

        this.renderer = renderer;

        this.scene = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -10, 10);

        this.textures = [];
        for (var i = 0; i < 6; i++)
            this.textures[i] = new THREE.ImageUtils.loadTexture('../assests/textures/transition/transition' + (i + 1) + '.png');

        this.quadmaterial = new THREE.ShaderMaterial({

            uniforms: {

                tDiffuse1: {
                    type: "t",
                    value: null
                },
                tDiffuse2: {
                    type: "t",
                    value: null
                },
                mixRatio: {
                    type: "f",
                    value: 0.0
                },
                threshold: {
                    type: "f",
                    value: 0.1
                },
                useTexture: {
                    type: "i",
                    value: 1,
                },
                tMixTexture: {
                    type: "t",
                    value: this.textures[0]
                }
            },
            vertexShader: [

                "varying vec2 vUv;",

                "void main() {",

                "vUv = vec2( uv.x, uv.y );",
                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

                "}"

            ].join("\n"),
            fragmentShader: [

                "uniform float mixRatio;",

                "uniform sampler2D tDiffuse1;",
                "uniform sampler2D tDiffuse2;",
                "uniform sampler2D tMixTexture;",

                "uniform int useTexture;",
                "uniform float threshold;",

                "varying vec2 vUv;",

                "void main() {",

                "vec4 texel1 = texture2D( tDiffuse1, vUv );",
                "vec4 texel2 = texture2D( tDiffuse2, vUv );",

                "if (useTexture==1) {",

                "vec4 transitionTexel = texture2D( tMixTexture, vUv );",
                "float r = mixRatio * (1.0 + threshold * 2.0) - threshold;",
                "float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);",

                "gl_FragColor = mix( texel1, texel2, mixf );",
                "} else {",

                "gl_FragColor = mix( texel2, texel1, mixRatio );",

                "}",
                "}"

            ].join("\n")

        });

        let quadgeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

        this.quad = new THREE.Mesh(quadgeometry, this.quadmaterial);
        this.scene.add(this.quad);

        // Link both scenes and their FBOs
        this.sceneA = sceneA;
        this.sceneB = sceneB;

        this.fbo_sceneA = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.fbo_sceneB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);


        this.quadmaterial.uniforms.tDiffuse1.value = this.fbo_sceneB;
        this.quadmaterial.uniforms.tDiffuse2.value = this.fbo_sceneA;

        // set uniforms
        this.setTextureThreshold(this.transitionParams.textureThreshold);
        this.useTexture(this.transitionParams.useTexture);
        this.setTexture(this.transitionParams.texture);

    };

    setTextureThreshold(value) {

        this.quadmaterial.uniforms.threshold.value = value;

    }

    useTexture(value) {

        this.quadmaterial.uniforms.useTexture.value = value ? 1 : 0;

    }

    setTexture(i) {

        this.quadmaterial.uniforms.tMixTexture.value = this.textures[i];

    }

    startAnimate(){ // need to be called once when being triggered. Should not be called in the loop.
        this.transitionParams.animateTransition = true;
    }
    getTransitionValue(){
        return this.transitionParams.transition;
    }
    update() { // need to be called in the animation loop


        if (this.transitionParams.animateTransition) {
            this.tween_transit.start();
        }

       this.quadmaterial.uniforms.mixRatio.value = this.transitionParams.transition;

        //draw scenes on the render target

        this.renderer.setRenderTarget(this.fbo_sceneA);
        this.renderer.render(this.sceneA.scene, this.sceneA.camera, this.fbo_sceneA, true);

        this.renderer.setRenderTarget(this.fbo_sceneB);
        this.renderer.render(this.sceneB.scene, this.sceneB.camera, this.fbo_sceneB, true);
        this.renderer.setRenderTarget(null);

        // Prevent render both scenes when it's not necessary

        if (this.transitionParams.transition == 0) {

            this.sceneA.update();
            this.renderer.render(this.sceneA.scene, this.sceneA.camera);


        } else if (this.transitionParams.transition == 1) {

            this.sceneB.update();
            this.scene = null;

            this.renderer.render(this.sceneB.scene, this.sceneB.camera);


        } else {

            // When 0<transition<1 render transition between two scenes

            this.sceneA.update();
            this.sceneB.update();

            this.renderer.render(this.scene, this.camera, null, true);

        }
     
     }
}