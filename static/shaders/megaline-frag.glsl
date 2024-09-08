#version 300 es

precision mediump float;

uniform vec2 uResolution;

out vec4 FragColor;

vec2 getNDC() {
    return gl_FragCoord.xy / uResolution;
}

void main() {
    vec2 ndc = getNDC();

    FragColor = vec4(ndc.xy, 0.0, 1);
}
