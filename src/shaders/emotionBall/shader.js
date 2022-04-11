let vertex_emotionBall = `
varying vec2 vUv;

void main()
{
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
`
let fragment_emotionBall = `
uniform float u_time;
uniform float u_colorNum;
uniform vec3 u_colors[ 5 ];

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
//-----------------------------------------------------------//
    vec3 color = vec3(0.625, 0.205, 0.235);
    float xoff = snoise(vUv + u_time * .15) * 0.2;
    vec2 pos = vec2(vUv * vec2(1., 2.2) * 0.7);
    pos.x += xoff;

    float DF = 0.;
    float scale1 = 0.1;
    float scale2 = 0.3;

    // Add a random position
    vec2 vel = vec2(0.3, 0.6);//第一层noise的运动方向
    DF += snoise(pos) * scale1;

    // Add a random position
    DF += snoise(pos - vel*u_time*0.1) * scale2;
    DF += 0.5;

    float colorRange = floor(10.*(1./u_colorNum))/10.;

    color = u_colors[0];
    float mixRange = 0.3;
    for(float i=0.;i<u_colorNum;i++){
        int i_ = int(i);
        color = mix(color, u_colors[i_], smoothstep(i*colorRange-mixRange, i*colorRange+mixRange, DF));
    }

    color += vec3(snoise(random2(vUv)) * 0.05);
    
    vec4 col = vec4(color,1.);
    vec4 bg = vec4(0.);
    float frequence = 0.3;

    col = mix(col,bg, noiseShape(vUv,0.3,0.8,frequence,1.));

    
    gl_FragColor= col;

}
`
export {vertex_emotionBall,fragment_emotionBall};



