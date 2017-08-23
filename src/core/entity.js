import { create_float_buffer, create_index_buffer } from './context.js';
import { math } from './math.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { materials } from '../materials/materials.js';

class Entity {
  constructor(options = {}) {
    this.position = options.position || zero_vector.slice();
    this.rotation = options.rotation || zero_vector.slice();
    this.scale = options.scale || unit_vector.slice();

    this.material = options.material || 'basic';

    this.color = options.color || [1.0, 1.0, 1.0];
    this.color_opacity = 1.0;

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

    const model_view_matrix_from = (this.parent && this.parent.model_view_matrix)
      || math.mat4.create();
    const model_view_matrix = math.mat4.identity(math.mat4.create());
    math.mat4.translate(model_view_matrix, model_view_matrix_from, this.position);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation[0], [1, 0, 0]);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation[1], [0, 1, 0]);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation[2], [0, 0, 1]);
    math.mat4.scale(model_view_matrix, model_view_matrix, this.scale);

    this.model_view_matrix = model_view_matrix;
    this.color_vec = [...this.color, this.color_opacity];
  }

  render() {
    !this.skip && this.material_desc.render(this);
  }

  // generate_shadow_map() {
  //   this.material_desc.generate_shadow_map && this.material_desc.generate_shadow_map(this);
  // }
}

export { Entity }
