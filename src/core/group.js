import { math } from './math.js';
import { obj_to_vec } from '../misc/utils.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';

class Group {
  constructor(options = {}) {
    this.position = options.position || Object.assign({}, zero_vector);
    this.rotation = options.rotation || Object.assign({}, zero_vector);
    this.scale = options.scale || Object.assign({}, unit_vector);
    this.origin = options.origin || Object.assign({}, zero_vector);
    this.entities = [];

    this.skip = false;
  }

  add(entity) {
    entity.parent = this;
    this.entities.push(entity);
  }

  update() {
    if (this.skip) {
      return;
    }
    const model_view_matrix = math.mat4.identity(math.mat4.create());
    math.mat4.translate(model_view_matrix, model_view_matrix, obj_to_vec(this.position));

    const origin = obj_to_vec(this.origin);
    const rev_origin = obj_to_vec({
      x: -this.origin.x,
      y: -this.origin.y,
      z: -this.origin.z
    });

    math.mat4.translate(model_view_matrix, model_view_matrix, rev_origin);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.x, [1, 0, 0]);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.y, [0, 1, 0]);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation.z, [0, 0, 1]);
    math.mat4.translate(model_view_matrix, model_view_matrix, origin);
    math.mat4.scale(model_view_matrix, model_view_matrix, obj_to_vec(this.scale));

    this.model_view_matrix = model_view_matrix;

    this.entities.forEach((entity) => {
      entity.update();
    });

    // this.material_desc = new materials[this.material];
  }

  render(ticks) {
    !this.skip && this.entities.forEach((entity) => {
      entity.render(ticks);
    });
  }
}

export { Group }
