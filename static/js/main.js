'use strict';
// welcome to megaline

// variables u can change
let import_prefix = "";
const fov = 75;
const heightMultiplier = 2.0;
const fps = 60;

// Turn on for personal website (helloworld3200.github.io)
const doProdCheck = true;

const debugTest = true;
const debugFPS = 5;

// shader background color (linear color space)
const shaderBGColor = [0.09412, 0.09412, 0.09412];

// dont change the following vars
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

const prodCheckID = "megaline-prod-check";

const debugBoxID = "megaline-debug-box";
const debugFPSID = "megaline-debug-fps";

const debugFPSInterval = 1000 / debugFPS;

let fragShaderPath = "static/shaders/megaline-frag.glsl";
let vertShaderPath = "static/shaders/megaline-vert.glsl";

const fovRadians = (fov * Math.PI) / 180;
const fpsInterval = 1000 / fps;

function prepareProd () {
    const prodDiv = document.getElementById(prodCheckID);
    const prodDivExists = prodDiv !== null;

    if (doProdCheck && prodDivExists) {
        import_prefix = "megaline/";
        console.log("In production mode");
    } else {
        console.log("In development mode");
    }
}

async function setupShaderPaths () {
    fragShaderPath = import_prefix + fragShaderPath;
    vertShaderPath = import_prefix + vertShaderPath;
}

async function setup (event) {
    console.log("Starting setup");
     
    await prepareProd();

    const shaders = await fetchShaders();

    init(shaders);
}

async function fetchShaders () {
    setupShaderPaths();

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
            bgColor: gl.getUniformLocation(shaderProgram, "uBGColor"),
        },
    };

    console.log("Shader program setup complete");

    return shaderProgramInfo;
}

function setupBuffers (gl, shaderProgramInfo) {
    const buffers = initBuffers(gl);
    setupVertexArray(gl, shaderProgramInfo, buffers);
    setupConstUniforms(gl, shaderProgramInfo);
    console.log("Buffers setup complete");
}

function setupConstUniforms (gl, shaderProgramInfo) {
    gl.uniform3f(shaderProgramInfo.uniformLocations.bgColor, shaderBGColor[0], shaderBGColor[1], shaderBGColor[2]);
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

    gl.useProgram(shaderProgramInfo.program);

    setupBuffers(gl, shaderProgramInfo);

    renderMainloop(gl, shaderProgramInfo, canvas, debugElements);
}

function setupOnLoad() {
    document.addEventListener("DOMContentLoaded", setup);
}

setupOnLoad();
