// welcome to megaline

const import_prefix = "";

async function fetchOptions() {
    const options_file = await fetch(import_prefix + "static/options.json")
    const options = await options_file.json();

    return options;
}

async function fetchShaders() {
    const frag_shader_file = await fetch(import_prefix + "static/shaders/megaline-frag.glsl");
    const vert_shader_file = await fetch(import_prefix + "static/shaders/megaline-vert.glsl");

    const frag_shader = await frag_shader_file.text();
    const vert_shader = await vert_shader_file.text()

    const shaders = {
        frag: frag_shader,
        vert: vert_shader
    };

    return shaders;
}

async function setup() {
    const options = await fetchOptions();
    const shaders = await fetchShaders();

    init(options, shaders);
}

function setDimensions (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function init (options, shaders) {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if (!glCompatCheck(gl)) return;

    setDimensions(canvas);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    const mgl_shader = glShaderProgram(gl, shaders.vert, shaders.frag);
}

setup();
