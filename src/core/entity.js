import { create_float_buffer, create_index_buffer, gl } from './context.js';
import { mat4 } from 'gl-matrix';
import { obj_to_vec, hex_to_vec } from '../misc/utils.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { materials } from '../materials/materials.js';

class Entity {
  constructor(options = {}) {
    this.position = options.position || Object.assign({}, zero_vector);
    this.rotation = options.rotation || Object.assign({}, zero_vector);
    this.scale = options.scale || Object.assign({}, unit_vector);

    this.color = options.color || '#CCCCCC';
    this.color_opacity = 1.0;

    this.color_vec = [...hex_to_vec(this.color), this.color_opacity];

    this.indices = this.indices || options.indices;
    this.vertices = this.vertices || options.vertices;

    this.material_type = 'basic';
    this.material = new materials[this.material_type];
    this.program = this.material.program;

    this.create_buffers();
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
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);
    gl.vertexAttribPointer(gl.getAttribLocation(this.program, "aVertex"), 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
    gl.drawElements(gl.TRIANGLES, this.buffers.qty, gl.UNSIGNED_SHORT, 0);

    this.material.update(this);
  }
}

export { Entity }
