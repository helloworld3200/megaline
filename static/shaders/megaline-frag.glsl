#version 300 es

precision mediump float;

uniform vec2 uResolution;
uniform vec2 uTime;

uniform vec3 uBackgroundColor;

out vec4 FragColor;

float normSin(float x) {
    return sin(x) * 0.5 + 0.5;
}

void main() {
    vec2 ndc = gl_FragCoord.xy / uResolution;

    float aboveSine = sin(uTime.x);
    if (ndc.x > 0) {
        FragColor = vec4(0, 0, 0, 0);
    } else {
        FragColor = vec4(0, 0, 1, 1);
    }
}
