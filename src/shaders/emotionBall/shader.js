let vertex_emotionBall = `
uniform float uTime;
// uniform float uSize;
// uniform float uNoise;
// uniform float ustate;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vNN;
varying vec3 vEye;
varying vec2 vUv;

// attribute vec3 aRandom;

/**
noise
*/
// Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}




void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    float rotation = 0.0;
    vec3 scale = vec3(1., 1., 1.);

    vec3 alignedPosition = position * scale;
    vec2 pos = alignedPosition.xy;

    vec2 rotatedPosition;
    rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
    rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;

    vec4 finalPosition;

    finalPosition = modelViewMatrix * vec4(1.0, 0.0, 0.0, 1.0);
    finalPosition.xy += rotatedPosition;
    finalPosition = projectionMatrix * finalPosition;

    gl_Position = finalPosition;

    //            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    // gl_Position = projectionMatrix * mvPosition;
}
`
let fragment_emotionBall = `
varying vec2 vUv;
uniform float uTime;
uniform float uColMix;
uniform float uFrequency;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(97.1, 311.7)),
        dot(st, vec2(69.5, 183.3)));

    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}


float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float stroke(float x, float s, float strokeWidth) {
    return step(s - strokeWidth * .5, x) - step(s + strokeWidth * .5, x);
}
float circleSDF(vec2 st) {
    return length(st - 0.5) * 2.; // map (-0.5,0.5) to (-1,1)
}

float noiseCircleSDF(vec2 st, float radius, float edgeSmooth, float offset) {
    float a = atan(st.y, st.x);
    float r = radius;
    r += sin(a * 2.) * 0.12 * noise(st*.7 + offset);
    return 1. - smoothstep(r, r + edgeSmooth, circleSDF(st));
}
float noiseShape(vec2 st, float radius,float edgeSmooth,float intensity,float offset) {
	st = vec2(0.5)-st;
    float r = length(st)*2.0;
    float a = atan(st.y,st.x);
    float m = abs(mod(a+uTime*2.,3.14*2.)-3.14)/2.864;
    float f = radius;
    m += noise(st+uTime*0.1)*.5;
    // a *= 1.+abs(atan(uTime*0.2))*.1;
    // a *= 1.+noise(st+uTime*0.1)*0.1;
     f += sin(a*1.)*noise(st+uTime*0.9+offset)*.2;
    f += sin(a*3.)*noise(st+uTime*1.9*intensity+offset)*.2*intensity;
    f += sin(a*1.)*noise(st+uTime*2.2*intensity+offset)*0.9*intensity;
    return smoothstep(f,f+edgeSmooth,r);
}
void main() {
    vec3 bg = vec3(0.,0.,0.);
    vec3 col  =vec3(0.0, 0.0, 0.0);

    vec3 col_joy1 = vec3(0.9882, 0.6078, 0.8275);
    vec3 col_joy2 = vec3(0.9882, 0.8431, 0.4431);

    vec3 col_sad1  =vec3(0.0667, 0.1882, 0.4118);
    vec3 col_sad2  =vec3(0.2745, 0.1412, 0.3137);

    vec3 col_angry1  =vec3(0.0863, 0.0588, 0.0);
    vec3 col_angry2  =vec3(0.7137, 0.1255, 0.0235);
    vec3 col1;
    vec3 col2;
    float frequence;

   if(uColMix>0.1){    
     col1  =mix(col_sad1,col_joy1,(uColMix-0.1)/0.9);
     col2  =mix(col_sad2,col_joy2,(uColMix-0.1)/0.9);
      frequence = 0.2;
    }else{
     col1  =mix(col_angry1,col_sad1,uColMix);
     col2  =mix(col_angry2,col_sad2,uColMix);
     frequence = 0.9;
    }


  //  vec3 bg = mix(vec3(0.1529, 0.1529, 0.1529),vec3(0.7137, 0.6902, 0.5647),vUv.y);

   col = mix(col1,col2, noiseShape(vUv,0.1,0.4,frequence,1.));

   
  gl_FragColor = mix(vec4(0.), vec4(col,1.0), 1.0-noiseShape(vUv,0.25,0.4,frequence,0.));

     //add fog
   #ifdef USE_FOG
      #ifdef USE_LOGDEPTHBUF_EXT
         float depth = gl_FragDepthEXT / gl_FragCoord.w;
      #else
         float depth = gl_FragCoord.z / gl_FragCoord.w;
      #endif
      float fogFactor = smoothstep( fogNear, fogFar, depth );
      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor);
   #endif

}
`

export {vertex_emotionBall,fragment_emotionBall};