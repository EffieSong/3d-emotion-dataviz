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