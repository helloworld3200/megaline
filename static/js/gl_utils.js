'use strict';
// Utility functions with WebGL

function glCompatCheck (gl) {
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return false;
    }
    return true;
}

function glLoadShader (gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function glShaderProgram (gl, vertSrc, fragSrc) {
    const shader_program = gl.createProgram();

    const vert = glLoadShader(gl, gl.VERTEX_SHADER, vertSrc);
    const frag = glLoadShader(gl, gl.FRAGMENT_SHADER, fragSrc);

    gl.attachShader(shader_program, vert);
    gl.attachShader(shader_program, frag);
    gl.linkProgram(shader_program);

    if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader_program));
        return null;
    }

    return shader_program;
}

function glLogVersions(gl) {
    console.log('WebGL Version:', gl.getParameter(gl.VERSION));
    console.log('GLSL Version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
}