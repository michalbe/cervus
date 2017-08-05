import { mat4 } from 'gl-matrix';
import { obj_to_vec } from '../misc/utils.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';

class Group {
  constructor(options = {}) {
    this.position = options.position || Object.assign({}, zero_vector);
    this.rotation = options.rotation || Object.assign({}, zero_vector);
    this.scale = options.scale || Object.assign({}, unit_vector);

    this.entities = [];
  }

  add(entity) {
    entity.parent = this;
    this.entities.push(entity);
  }

  update() {
    const model_view_matrix = mat4.identity(mat4.create());
    mat4.translate(model_view_matrix, model_view_matrix, obj_to_vec(this.position));
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.x, [1, 0, 0]);
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.y, [0, 1, 0]);
    mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.z, [0, 0, 1]);
    mat4.scale(model_view_matrix, model_view_matrix, obj_to_vec(this.scale));

    this.model_view_matrix = model_view_matrix;

    this.entities.forEach((entity) => {
      entity.update();
    });

    // this.material_desc = new materials[this.material];
  }

  render(ticks) {
    this.entities.forEach((entity) => {
      entity.render(ticks);
    });
  }
}

export { Group }
