#version 300 es

precision mediump float;

uniform vec2 uResolution;
uniform vec2 uTime;

uniform vec3 uBGColor;

out vec4 FragColor;

float normSin(float x) {
    return sin(x) * 0.5 + 0.5;
}

void main() {
    vec2 ndc = gl_FragCoord.xy / uResolution;

    float aboveSine = sin(uTime.x);
    FragColor = vec4(uBGColor, 1);
}
