let vertex_emotionBall = `
varying vec2 vUv;
uniform float u_scale;

void main()
{
    vUv = uv;
    // //make it sprite
    // float rotation = 0.0;
  
    // vec3 alignedPosition = position * u_scale;
    // vec2 pos = alignedPosition.xy;
  
    // vec2 rotatedPosition;
    // rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
    // rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;
  
    // vec4 finalPosition;
  
    // finalPosition = modelViewMatrix * vec4(1.0,0.0,0.0, 1.0);
    // finalPosition.xy += rotatedPosition;
    // finalPosition = projectionMatrix * finalPosition;
  
    // gl_Position = finalPosition;
    
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
`
let fragment_emotionBall = `
uniform float u_time;
uniform float u_colorNum;
uniform vec3 u_colors[ 5 ];

uniform float u_opacity;
uniform float u_saturation;
uniform float u_lightness;

uniform float u_amplitude; //0-1
uniform float u_motionSpeed;  //0-1
uniform float u_edgeSmooth;  //0-1
uniform float u_glitchFrequency; // 0-5
uniform float u_glitchAmplitude; //0-1




varying vec2 vUv;

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
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float snoise2(vec2 v) {
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
/* 3d simplex noise */
float snoise3(vec3 p) {
    /* skew constants for 3d simplex functions */
 float F3 =  0.3333333;
 float G3 =  0.1666667;
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
	 
	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));
	 
	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);
	 	
	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;
	 
	 /* 2. find four surflets and store them in d */
	 vec4 w, d;
	 
	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);
	 
	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);
	 
	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);
	 
	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;
	 
	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

float noise2(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(dot(random2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
            dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
        mix(dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
            dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float noiseShape(vec2 st, float radius,float edgeSmooth, float amplitude,float motionSpeed, float offset) {
	st = vec2(0.5)-st;
    float r = length(st)*2.0;
    float a = atan(st.y,st.x);
    float m = abs(mod(a+u_time*2.,3.14*2.)-3.14)/2.864;
    float f = radius;
    m += noise2(st+u_time*0.1)*.5;
    f += sin(a*1.)*noise2(st+u_time*0.2+offset)*.2;
    f += sin(a*3.)*noise2(st+u_time*1.9*motionSpeed+offset)*.2*amplitude;
    f += sin(a*1.)*noise2(st+u_time*2.2*motionSpeed+offset)*0.9*amplitude;
    return smoothstep(f-edgeSmooth/2.,f+edgeSmooth/2.,r);
}

void main()
{
//-----------------------------------------------------------//
    vec2 st =vUv;

    float x = st.x;
    float y = st.y; 
    st.x += sin((y-u_time*.2 * u_motionSpeed)* 8. * u_glitchFrequency)* 0.1 * u_glitchAmplitude +noise2(st+u_time*.15)*0.6*u_glitchAmplitude;
    st.y += sin((x-u_time *.2 * u_motionSpeed)*5.) * 0.1 * u_glitchAmplitude +noise2(st+u_time*.15)*0.;
 

    vec3 color = vec3(0.625, 0.205, 0.235);
    float xoff = snoise2(st + u_time * .15) * 0.2;
    vec2 pos = vec2(st * vec2(1., 2.2) * 0.7);
    pos.x += xoff;

    float DF = 0.;
    float scale1 = 0.1;
    float scale2 = 0.3;

    // Add a random position
    vec2 vel = vec2(0.3, 0.6);//第一层noise的运动方向
    DF += snoise2(pos) * scale1;

    // Add a random position
    DF += snoise2(pos - vel*u_time*0.1) * scale2;
    DF += 0.5;

    float colorRange = floor(10.*(1./u_colorNum))/10.;

    color = u_colors[0];
    float mixRange = 0.3;
    for(float i=0.;i<u_colorNum;i++){
        int i_ = int(i);
        color = mix(color, u_colors[i_], smoothstep(i*colorRange-mixRange, i*colorRange+mixRange, DF));
    }

    color += vec3(snoise2(random2(st)) * 0.05);
    
    vec4 bg = vec4(0.0, 0.0, 0.0, 0.0);

    // Satuation
    color = mix(vec3(0.2039, 0.2039, 0.2039),color,u_saturation);

    // Lightness
    color *= vec3(u_lightness);

    vec4 col = vec4(color,1.);

    // Shape
    col = mix(col,bg, noiseShape(st,0.5,u_edgeSmooth,u_amplitude, u_motionSpeed,1.));
    col.a *= u_opacity;

    gl_FragColor= vec4(col);

}
`
export {vertex_emotionBall,fragment_emotionBall};



