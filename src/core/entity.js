import { create_float_buffer, create_index_buffer } from './context.js';
import { mat4 } from 'gl-matrix';
import { obj_to_vec, hex_to_vec } from '../misc/utils.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { materials } from '../materials/materials.js';

class Entity {
  constructor(options = {}) {
    this.position = options.position || Object.assign({}, zero_vector);
    this.rotation = options.rotation || Object.assign({}, zero_vector);
    this.scale = options.scale || Object.assign({}, unit_vector);

    this.material = options.material || 'basic';

    this.color = options.color || '#FF00FF';
    this.color_opacity = 1.0;

    this.color_vec = [...hex_to_vec(this.color), this.color_opacity];

    this.indices = this.indices || options.indices;
    this.vertices = this.vertices || options.vertices;
    this.normals = this.normals || options.normals;

    this.material_desc = new materials[this.material];
    this.program = this.material_desc.program;

    this.skip = false;

    this.create_buffers();
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals)
    }
  }

  update_material() {
    this.material_desc = new materials[this.material];
  }

  update() {
    if (this.skip) {
      return;
    }

    const model_view_matrix_from = (this.parent && this.parent.model_view_matrix) || mat4.create();
    const model_view_matrix = mat4.identity(mat4.create());
    mat4.translate(model_view_matrix, model_view_matrix_from, obj_to_vec(this.position));
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.x, [1, 0, 0]);
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.y, [0, 1, 0]);
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.z, [0, 0, 1]);
    mat4.scale(model_view_matrix, model_view_matrix, obj_to_vec(this.scale));

    this.model_view_matrix = model_view_matrix;
    this.color_vec = [...hex_to_vec(this.color), this.color_opacity];
  }

  render() {
    !this.skip && this.material_desc.render(this);
  }

  // generate_shadow_map() {
  //   this.material_desc.generate_shadow_map && this.material_desc.generate_shadow_map(this);
  // }
}

export { Entity }
