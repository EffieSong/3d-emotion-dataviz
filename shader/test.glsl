// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

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
float stroke(float x, float strokeWidth, float s){
    return step(s-strokeWidth*.5,x)-step(s+strokeWidth*.5,x);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    vec3 color = vec3(0.625, 0.205, 0.235);
    float xoff = snoise(st + u_time * .15) * 0.2;
    vec2 pos = vec2(st * vec2(1., 2.2) * 0.7);
    pos.x += xoff;

    float DF = 0.;
    float scale1 = 0.5;
    float scale2 = 1.-scale1;

    // Add a random position
    vec2 vel = vec2(0.3, 0.6);//第一层noise的运动方向
    DF += snoise(pos) * scale1;

    // Add a random position
   // vel = vec2(u_mouse / u_resolution * 0.9);
    DF += snoise(pos - vel*u_time*0.1) * scale2;
    DF += 0.15;

    float colorNum = 3.;
    float colorRange = floor(10.*(1./colorNum))/10.;
    vec3 color0 = vec3(0.0392, 0.0275, 0.0275);
    vec3 color1 = vec3(0.9529, 0.3647, 0.1333);
    vec3 color2 = vec3(0.6902, 0.7255, 0.6549);
    vec3 color3 = vec3(0.1765, 0.3333, 0.7608);

    color = mix(color0, color1, smoothstep(colorRange-0.1, colorRange+0.1, DF));
    color = mix(color, color2, smoothstep(2.*colorRange, 2.*colorRange, DF));
  //  color = mix(color, color3, smoothstep(0.4, 0.6, DF));
 //   color = mix(color, color0, smoothstep(0.4, 0.8, DF));

    color += vec3(snoise(random2(st)) * 0.1);
    gl_FragColor = vec4(color, 1.0);
}