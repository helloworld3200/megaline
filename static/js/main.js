'use strict';
// welcome to megaline

// variables u can change
const import_prefix = "";
const fov = 75;
const heightMultiplier = 2.0;

// dont change
const fullscreenQuad = new Float32Array([
    -1.0, -1.0, // Bottom-left
     1.0, -1.0, // Bottom-right
    -1.0,  1.0, // Top-left
    -1.0,  1.0, // Top-left
     1.0, -1.0, // Bottom-right
     1.0,  1.0  // Top-right
]);

const fovRadians = (fov * Math.PI) / 180;

async function setup() {
    const options = await fetchOptions();
    const shaders = await fetchShaders();

    init(options, shaders);
}

async function fetchOptions() {
    const options_file = await fetch(import_prefix + "static/options.json")
    const options = await options_file.json();

    return options;
}

async function fetchShaders() {
    const frag_shader_file = await fetch(import_prefix + "static/shaders/megaline-frag.glsl");
    const vert_shader_file = await fetch(import_prefix + "static/shaders/megaline-vert.glsl");

    const frag_shader = await frag_shader_file.text();
    const vert_shader = await vert_shader_file.text();

    const shaders = {
        frag: frag_shader,
        vert: vert_shader
    };

    return shaders;
}

function setDimensions (canvas, gl) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * heightMultiplier;

    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initBuffers(gl) {
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, fullscreenQuad, gl.STATIC_DRAW);

    return {
        position: positionBuffer
    };
}

function clearCanvas (gl) {
    gl.clearColor(1.0, 1.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
}

function getShaderProgramInfo (gl, shaderProgram) {
    return {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            resolution: gl.getUniformLocation(shaderProgram, "uResolution"),
        },
    };
}

function setupBuffers (gl, shaderProgramInfo) {
    const buffers = initBuffers(gl);
    setupVertexArray(gl, shaderProgramInfo, buffers);
}

function setupVertexArray (gl, shaderProgramInfo, buffers) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(shaderProgramInfo.attribLocations.vertexPosition);
    gl.vertexAttribPointer(shaderProgramInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
}

function setupUniforms (gl, shaderProgramInfo, canvas) {
    gl.uniform2f(shaderProgramInfo.uniformLocations.resolution, canvas.width, canvas.height);
}

function init (options, shaders) {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl2");

    if (!glCompatCheck(gl)) return;

    glLogVersions(gl);

    setDimensions(canvas, gl);

    const shaderProgram = glShaderProgram(gl, shaders.vert, shaders.frag);

    const shaderProgramInfo = getShaderProgramInfo(gl, shaderProgram);

    setupBuffers(gl, shaderProgramInfo);

    gl.useProgram(shaderProgramInfo.program);

    setupUniforms(gl, shaderProgramInfo, canvas);

    clearCanvas(gl);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

setup();
