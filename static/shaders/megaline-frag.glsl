#version 300 es

precision mediump float;

uniform vec2 uResolution;
uniform vec2 uTime;

out vec4 FragColor;

vec2 getNDC() {
    return gl_FragCoord.xy / uResolution;
}

float normSin(float x) {
    return sin(x) * 0.5 + 0.5;
}

void main() {
    vec2 ndc = getNDC();

    FragColor = vec4(step(normSin(uTime.x), ndc.y), 0, 0.0, 1);
}
