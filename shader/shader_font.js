const vertex =`
// Variable qualifiers that come with the msdf shader
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
varying vec2 vUv;
// We passed this one
uniform float time;

void main() {
  vUv = uv;

  vec3 p = vec3(position.x, position.y, position.z);

  float frequency1 = 0.035;
  float amplitude1 = 20.0;
  float frequency2 = 0.025;
  float amplitude2 = 70.0;

  // Oscillate vertices up/down
  p.y += (sin(p.x * frequency1 + time) * 0.5 + 0.5) * amplitude1;

  // Oscillate vertices inside/outside
  p.z += (sin(p.x * frequency2 + time) * 0.5 + 0.5) * amplitude2;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const fragment =`
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

// Variable qualifiers that come with the shader
precision highp float;
uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vUv;
// We passed this one
uniform float time;

// HSL to RGB color conversion module
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  // This is the code that comes to produce msdf
  vec3 sample = texture2D(map, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  // Colors
  vec3 lightBlue = hsl2rgb(202.0 / 360.0, 1.0, 0.5);
  vec3 navyBlue = hsl2rgb(238.0 / 360.0, 0.47, 0.31);

  // Goes from 1.0 to 0.0 and vice versa
  float t = cos(time) * 0.5 + 0.5;

  // Interpolate from light to navy blue
  vec3 newColor = mix(lightBlue, navyBlue, t);

  gl_FragColor = vec4(newColor, alpha * opacity);

  if (gl_FragColor.a < 0.0001) discard;
}
`

export {vertex,fragment}