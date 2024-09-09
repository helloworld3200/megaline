'use strict';
// welcome to megaline

// variables u can change
const import_prefix = "";
const fov = 75;
const heightMultiplier = 2.0;
const fps = 60;

const debugTest = true;
const debugFPS = 5;

// dont change
const fullscreenQuad = new Float32Array([
    -1.0, -1.0, // Bottom-left
     1.0, -1.0, // Bottom-right
    -1.0,  1.0, // Top-left
    -1.0,  1.0, // Top-left
     1.0, -1.0, // Bottom-right
     1.0,  1.0  // Top-right
]);

const webgl2 = "webgl2";
const canvasID = "megaline-main-canvas";

const debugBoxID = "megaline-debug-box";
const debugFPSID = "megaline-debug-fps";

const debugFPSInterval = 1000 / debugFPS;

const fragShaderPath = import_prefix + "static/shaders/megaline-frag.glsl";
const vertShaderPath = import_prefix + "static/shaders/megaline-vert.glsl";

const fovRadians = (fov * Math.PI) / 180;
const fpsInterval = 1000 / fps;

async function setup() {
    console.log("Starting setup");
    const shaders = await fetchShaders();

    init(shaders);
}

async function fetchShaders() {
    const frag_shader_file = await fetch(fragShaderPath);
    const vert_shader_file = await fetch(vertShaderPath);

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

function setupShaderProgramInfo (gl, shaders) {
    const shaderProgram = glShaderProgram(gl, shaders.vert, shaders.frag);

    const shaderProgramInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
        },
        uniformLocations: {
            resolution: gl.getUniformLocation(shaderProgram, "uResolution"),
            time: gl.getUniformLocation(shaderProgram, "uTime"),
        },
    };

    console.log("Shader program setup complete");

    return shaderProgramInfo;
}

function setupBuffers (gl, shaderProgramInfo) {
    const buffers = initBuffers(gl);
    setupVertexArray(gl, shaderProgramInfo, buffers);
    console.log("Buffers setup complete");
}

function setupVertexArray (gl, shaderProgramInfo, buffers) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(shaderProgramInfo.attribLocations.vertexPosition);
    gl.vertexAttribPointer(shaderProgramInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
}

function setupUniforms (gl, shaderProgramInfo, canvas, time) {
    gl.uniform2f(shaderProgramInfo.uniformLocations.resolution, canvas.width, canvas.height);
    gl.uniform2f(shaderProgramInfo.uniformLocations.time, time[0], time[1]);
}

function drawScene (gl, shaderProgramInfo, canvas, time) {
    setupUniforms(gl, shaderProgramInfo, canvas, time);
    clearCanvas(gl);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function setupDebugBox () {
    const debugBox = document.getElementById(debugBoxID);
    if (!debugTest) {
        debugBox.style.display = "none";
    }
    
    return debugBox;
}

function setupDebugElements () {
    const debugElements = {
        debugBox: setupDebugBox(),
        fps: document.getElementById(debugFPSID),
    };

    return debugElements;
}

function renderMainloop (gl, shaderProgramInfo, canvas, debugElements) {
    let currentFPS = 0;

    let then = 0;

    function render (now) {
        now *= 0.001;

        const deltaTime = now - then;
        then = now;

        const time = [now, deltaTime];

        currentFPS = 1 / deltaTime;

        drawScene(gl, shaderProgramInfo, canvas, time);
    }

    function debugRender () {
        debugElements.fps.innerHTML = Math.round(currentFPS);
    }

    console.log("Rendering mainloop started");
    const debugRenderInterval = setInterval(debugRender, debugFPSInterval);
    const mainRenderInterval = setInterval(() => {requestAnimationFrame(render)}, fpsInterval);
}

function init (shaders) {
    const canvas = document.getElementById(canvasID);
    const gl = canvas.getContext(webgl2);
    
    const debugElements = setupDebugElements();

    if (!glCompatCheck(gl)) return;

    glLogVersions(gl);

    setDimensions(canvas, gl);
    window.addEventListener("resize", () => setDimensions(canvas, gl));

    const shaderProgramInfo = setupShaderProgramInfo(gl, shaders);

    setupBuffers(gl, shaderProgramInfo);

    gl.useProgram(shaderProgramInfo.program);

    renderMainloop(gl, shaderProgramInfo, canvas, debugElements);
}

setup();
