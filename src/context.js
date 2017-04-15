import { mat4 } from 'gl-matrix';

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

function create_texture_object(image) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.bindTexture(gl.TEXTURE_2D, null);

  return texture;
}

function set_projection(program, fov, aspect, near, far) {
  const projection_matrix = mat4.create();
  mat4.perspective(
    fov,
    aspect,
    near,
    far,
    projection_matrix
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

function set_model_view(program, pos, rot, axis) {
  const model_view_matrix = mat4.identity(mat4.create());

  mat4.translate(model_view_matrix, pos);
  mat4.rotate(model_view_matrix, rot, axis);

  gl.uniformMatrix4fv(
    gl.getUniformLocation(program, "uModelView"),
    false,
    model_view_matrix
  );

  return model_view_matrix;
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
