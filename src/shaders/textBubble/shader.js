let vertex_textBubble = `
uniform float u_time;
uniform float u_scale;

varying vec2 vUv;
varying vec3 vNN;
varying vec3 vEye;

/**
noise
*/
// Classic Perlin 3D Noise 
// by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
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

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

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
    return  n_xyz+0.3;
}


float generateHeight(vec3 pos){
    float hill = 0.;
    //create a flat path
    float scale = 0.;
    float width = 4.5;
    scale = smoothstep(width/2.-1.2,width/2.+1.2,1.);
    
    //make the hill noise from front to back
    float a = step(pos.x,0.)*2.-1.;
    a*=0.4;

   vec3 p = vec3(pos.x*0.4+u_time*a,pos.y*0.3+u_time*0.4,pos.z);
   hill += cnoise(p);
   hill += 1.* cnoise(vec3(pos.x*0.2+u_time*a,pos.y*0.3+0.5,pos.z));
   hill += 1.* cnoise(vec3(pos.x*0.6+u_time*a,pos.y*0.1+0.5,pos.z));
 //  vec3 p2 = vec3(1.,pos.y*0.2+1.,pos.z)*0.7;
 //  hill += 7.7 * cnoise(p2);
   hill *= scale *0.9;
   hill += 0.5* cnoise(pos*0.2);
   return hill;
}


void main()
{
    vUv = uv;
    
    
    mat4 LM = modelMatrix;
          LM[2][3] = 0.0;
          LM[3][0] = 0.0;
          LM[3][1] = 0.0;
          LM[3][2] = 0.0;

    vec4 GN = LM * vec4(normal.xyz, 1.0);

    vNN = normalize(GN.xyz);
    vEye = normalize(GN.xyz-cameraPosition);

    vec3 transformed = position;
   // transformed.y += generateHeight(position);

   transformed.x += 1.5*cnoise(position.xyz*0.1+u_time);
   transformed.y += 1.5*cnoise(position.yzx*0.1+u_time);
   transformed.z += 1.5*cnoise(position.zxy*0.1+u_time);



    vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );


    gl_Position = projectionMatrix * mvPosition;
}
`
let fragment_textBubble = `
uniform float u_time;
uniform float u_scale;
uniform float u_opacity;

uniform sampler2D u_texture;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vNN; 
varying vec3 vEye;

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec3 permute(vec3 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}
vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(97.1, 311.7)),
        dot(st, vec2(69.5, 183.3)));

    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, // (3.0-sqrt(3.0))/6.0
        0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
        -0.577350269189626, // -1.0 + 2.0 * C.x
        0.024390243902439); // 1.0 / 41.0
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) +
        i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 140.0 * dot(m, g);
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

float noiseShape(vec2 st, float radius,float edgeSmooth,float intensity,float offset) {
	st = vec2(0.5)-st;
    float r = length(st)*2.0;
    float a = atan(st.y,st.x);
    float m = abs(mod(a+u_time*2.,3.14*2.)-3.14)/2.864;
    float f = radius;
    m += noise(st+u_time*0.1)*.5;
    // a *= 1.+abs(atan(u_time*0.2))*.1;
    // a *= 1.+noise(st+u_time*0.1)*0.1;
     f += sin(a*1.)*noise(st+u_time*0.9+offset)*.2;
    f += sin(a*3.)*noise(st+u_time*1.9*intensity+offset)*.2*intensity;
    f += sin(a*1.)*noise(st+u_time*2.2*intensity+offset)*0.9*intensity;
    return smoothstep(f,f+edgeSmooth,r);
}

void main()
{

  vec2 uv = vUv;
 // uv = fract(uv*1.);
   vec4 color = texture2D(u_texture,uv);
    
    gl_FragColor= color;

  //  fresnelColor
   vec3 fresnelColor = vec3(1.,1.,1.);
    gl_FragColor = vec4(gl_FragColor.rbg, 0.);

    gl_FragColor.rgb +=  ( 1.0- -min(dot(vEye, normalize(vNN) ), 0.0) ) * fresnelColor;
    gl_FragColor.a += 0.5 - ( 1.0- -min(dot(vEye, normalize(vNN) ), 0.7) ) * 0.4;
    gl_FragColor.a *= max(color.a,u_opacity);

}
`
export {
    vertex_textBubble,
    fragment_textBubble
};