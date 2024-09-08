#version 300 es

in vec2 aVertexPosition;

const float zPos = 0.0;

void main() {
    gl_Position = vec4(aVertexPosition, zPos, 1.0);
}
