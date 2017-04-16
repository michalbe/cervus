import { create_float_buffer, create_index_buffer, gl, program } from './context.js';
import { mat4 } from 'gl-matrix';
import { obj_to_vec, hex_to_vec } from '../misc/utils.js';

const zero_vector = {
  x: 0,
  y: 0,
  z: 0
};

const unit_vector = {
  x: 1,
  y: 1,
  z: 1
};

class Entity {
  constructor(options) {
    this.position = Object.assign({}, zero_vector);
    this.rotation = Object.assign({}, zero_vector);
    this.scale = Object.assign({}, unit_vector);

    this.color = '#CCCCCC';
    this.color_opacity = 1.0;

    this.color_vec = [...hex_to_vec(this.color), this.color_opacity];

    this.indices = options.indices;
    this.vertices = options.vertices;

    this.create_buffers();

    this.rotation_offset = Math.random();
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length
    }
  }

  update() {
    const model_view_matrix = mat4.identity(mat4.create());
    mat4.translate(model_view_matrix, model_view_matrix, obj_to_vec(this.position));
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.x, [1, 0, 0]);
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.y, [0, 1, 0]);
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.z, [0, 0, 1]);
    mat4.scale(model_view_matrix, model_view_matrix, obj_to_vec(this.scale));

    this.model_view_matrix = model_view_matrix;

    this.color_vec = [...hex_to_vec(this.color), this.color_opacity];
  }

  render() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
    gl.vertexAttribPointer(gl.getAttribLocation(program, "aVertex"), 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.drawElements(gl.TRIANGLES, this.buffers.qty, gl.UNSIGNED_SHORT, 0);

    gl.uniform4fv(
      gl.getUniformLocation(program, "uColor"),
      this.color_vec
    );

    gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "uModelView"),
      false,
      this.model_view_matrix
    );
  }
}

export { Entity }
