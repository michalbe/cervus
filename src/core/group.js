import { math } from './math.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';

class Group {
  constructor(options = {}) {
    this.position = options.position || zero_vector.slice();
    this.rotation = options.rotation || zero_vector.slice();
    this.scale = options.scale || unit_vector.slice();
    this.origin = options.origin || zero_vector.slice();
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
    math.mat4.translate(model_view_matrix, model_view_matrix, this.position);

    const origin = this.origin;
    const rev_origin = this.origin.map((e) => -e);

    math.mat4.translate(model_view_matrix, model_view_matrix, rev_origin);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation[0], [1, 0, 0]);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation[1], [0, 1, 0]);
    math.mat4.rotate(model_view_matrix, model_view_matrix, this.rotation[2], [0, 0, 1]);
    math.mat4.translate(model_view_matrix, model_view_matrix, origin);
    math.mat4.scale(model_view_matrix, model_view_matrix, this.scale);

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
