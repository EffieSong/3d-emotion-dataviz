global.THREE = require("three");
const THREE = global.THREE;
const loadFont = require("load-bmfont");
const createGeometry = require("three-bmfont-text");
const MSDFShader = require("three-bmfont-text/shaders/msdf");

// Font assets
const fontFile = require("../../assets/bmfonts/Lato-Black.fnt");
const fontAtlas = require("../../assets/bmfonts/Lato-Black.png");

// Nice colors
const colors = require("nice-color-palettes");
const palette = colors[7];
const background = palette[0];
const fontColor = parseInt(palette[2].replace("#", "0x"));

export default class WebGLFont {
  constructor(opts = {}) {
    // Options obj
    this.options = opts;
    this.f = `
precision highp float;
out vec4 outColor;

void main() {
	float a = fwidth(1.0);
	outColor = vec4(1.0, 0.0, 0.0, 1.0);
}`;

    this.v = `
in vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * position;
}
`;

    // Variables
    this.vars = {
      word: this.options.word,
      position: [...this.options.position],
      rotation: [...this.options.rotation],
      zoom: this.options.zoom,
      vertex: this.options.vertex,
      fragment: this.options.fragment
    };

    // Scene
    this.scene = opts.scene;
    // Clock
    this.clock = new THREE.Clock();
    // Load font files to initialize renderer
    this.loadBMF();
  }

  loadBMF() {
    // Create geometry of packed glyphs
    loadFont(fontFile, (err, font) => {
      this.geometry = createGeometry({
        font,
        text: this.vars.word
      });
    });

    // Load texture containing font glyphs
    this.loader = new THREE.TextureLoader();
    this.loader.load(fontAtlas, texture => {
      this.createMesh(this.geometry, texture);
    });
  }

  createMesh(geometry, texture) {
    // Material
    this.material = new THREE.RawShaderMaterial(
      MSDFShader({
        vertexShader: this.vars.vertex,
        fragmentShader: this.vars.fragment,
        color: fontColor,
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        negate: false,
      })
    );

    // this.material = new THREE.RawShaderMaterial({
    //   fragmentShader: this.f,
    //   vertexShader: this.v,
    //   uniforms: {},
    //   glslVersion: THREE.GLSL3,
    // });

    // Create time variable from prestablished shader uniforms
    this.material.uniforms.time = {
      type: "f",
      value: 0.0
    };

    // Mesh
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.set(...this.vars.position);
    this.mesh.rotation.set(...this.vars.rotation);
    this.scene.add(this.mesh);
  }

  update() {
    // Update time uniform
    this.mesh.material.uniforms.time.value = this.clock.getElapsedTime();
    this.mesh.material.uniformsNeedUpdate = true;
  }
}