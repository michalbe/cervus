import { mat4 } from 'gl-matrix';

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

function create_float_buffer(data) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  return buffer;
}

function create_index_buffer(data) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  return buffer;
}

function create_shader_object(shaderType, source) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw gl.getShaderInfoLog(shader);
  }
  return shader;
}

function create_program_object(vs, fs) {
  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw gl.getProgramInfoLog(program);
  }
  return program;
}

function create_texture_object(image) {
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

function set_projection(program, fov, aspect, near, far) {
  var projMatrix = mat4.create();
  mat4.perspective(
    fov,
    aspect,
    near, far,
    projMatrix
  );

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uProjection"),
    false,
    projMatrix
  );
  return projMatrix;
}

function set_normal_matrix(program, mv) {
  // use this instead if model-view has been scaled
  /*
  var normalMatrix = mat4.toInverseMat3(mv);
  mat3.transpose(normalMatrix);
  */

  var normalMatrix = mat4.toMat3(mv);
  gl.uniformMatrix3fv(
    gl.getUniformLocation(program, "uNormalMatrix"),
    false,
    normalMatrix
  );
  return normalMatrix;
}

function set_model_view(program, pos, rot, axis) {
  var mvMatrix = mat4.identity(mat4.create());

  mat4.translate(mvMatrix, pos);
  mat4.rotate(mvMatrix, rot, axis);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uModelView"),
    false,
    mvMatrix
  );
  return mvMatrix;
}

export {
  gl,
  canvas,
  create_float_buffer,
  create_index_buffer,
  create_shader_object,
  create_program_object,
  create_texture_object,
  set_projection,
  set_normal_matrix,
  set_model_view
};
