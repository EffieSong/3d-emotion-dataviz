 import * as THREE from 'three'


 export default class HumanTexture {
     constructor(opts = {}) {
         this.scene = opts.scene
         this.file = opts.file
         this.vertex = opts.vertex
         this.fragment = opts.fragment
         this.start_time = Date.now()
         this.init();
     }
     init() {
         /*  Mesh Material  */
         this.meshMaterial = new THREE.MeshBasicMaterial({
             color: 'white',
             wireframe: true
         })
         this.shaderMaterial = new THREE.ShaderMaterial({
             vertexShader: this.vertex,
             fragmentShader: this.fragment,
             transparent: true,
             // blending: THREE.LightenBlending,
             uniforms: {
                 u_time: {
                     value: 0
                 },
                 tOne: {
                     type: "t",
                     value: THREE.TextureLoader(this.file)
                 },
                 u_colorNum: {
                     value: 2
                 },
                 u_colors: {
                     value: [new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,255,255)"), new THREE.Color("rgb(255,40,40)"), new THREE.Color("rgb(0,0,0)"), new THREE.Color("rgb(0,0,0)")]
                 }

             }
         })
         let planeGeometry = new THREE.PlaneGeometry(3, 3);
         this.mesh = new THREE.Mesh(planeGeometry, this.shaderMaterial);
         this.scene.add(this.mesh)
         console.log(this.mesh);
     }

     update(){
         console.log("update");
        this.shaderMaterial.uniforms.u_time.value = (Date.now() - this.start_time) * .001;
     }
 };