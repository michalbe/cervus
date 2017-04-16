import { mat4 } from 'gl-matrix';
import { vertex_code, fragment_code } from '../shaders/shaders.js';

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

function create_float_buffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  return buffer;
}

function create_index_buffer(data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

function create_shader_object(shader_type, source) {
  const shader = gl.createShader(shader_type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }

  return shader;
}

function create_program_object(vs, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }

  return program;
}

function set_projection(program, fov, aspect, near, far) {
  const projection_matrix = mat4.create();
  mat4.perspective(
    projection_matrix,
    fov,
    aspect,
    near,
    far
  );

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uProjection"),
    false,
    projection_matrix
  );

  return projection_matrix;
}

function set_normal_matrix(program, mv) {
  // use this instead if model-view has been scaled
  /*
  const normal_matrix = mat4.toInverseMat3(mv);
  mat3.transpose(normal_matrix);
  */

  const normal_matrix = mat4.toMat3(mv);
  gl.uniformMatrix3fv(
    gl.getUniformLocation(program, "uNormalMatrix"),
    false,
    normal_matrix
  );

  return normal_matrix;
}

const program = create_program_object(
  create_shader_object(gl.VERTEX_SHADER, vertex_code),
  create_shader_object(gl.FRAGMENT_SHADER, fragment_code)
);

export {
  gl,
  canvas,
  create_float_buffer,
  create_index_buffer,
  create_shader_object,
  create_program_object,
  set_projection,
  set_normal_matrix,
  program
};
