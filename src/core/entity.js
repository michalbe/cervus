import { create_float_buffer, create_index_buffer } from './context.js';
import { math } from './math.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { materials } from '../materials/materials.js';

class Entity {
  constructor(options = {}) {
    this.model_view_matrix = math.mat4.create();

    this.position = options.position || zero_vector.slice();
    this.scale = options.scale || unit_vector.slice();

    this.material = options.material;

    this.color = options.color || [1.0, 1.0, 1.0];
    this.color_opacity = 1.0;

    this.keyboard_controlled = false;

    this.move_speed = 3.5;
    this.rotate_speed = 1.5;

    this.indices = this.indices || options.indices;
    this.vertices = this.vertices || options.vertices;
    this.normals = this.normals || options.normals;

    this.material_desc = this.material && new materials[this.material];
    this.program = this.material_desc && this.material_desc.program;

    this.skip = false;

    this.dir = {};

    this.dir_desc = {
      87: 'f',
      65: 'l',
      68: 'r',
      83: 'b',
      81: 'u',
      69: 'd',
      38: 'r_u',
      40: 'r_d',
      39: 'r_r',
      37: 'r_l'
    };

    if (this.vertices && this.indices && this.normals) {
      this.create_buffers();
    }
  }

  look_at(vec, up = this.up) {
    math.mat4.target_to(this.model_view_matrix, this.position, vec, up);
  }

  get right() {
    const out = [
      this.model_view_matrix[0],
      this.model_view_matrix[1],
      this.model_view_matrix[2]
    ];
    // XXX Is this needed?
    return math.vec3.normalize(out, out);
  }

  get forward() {
    const out = [
      this.model_view_matrix[4],
      this.model_view_matrix[5],
      this.model_view_matrix[6]
    ];
    return math.vec3.normalize(out, out);
  }

  get up() {
    const out = [
      this.model_view_matrix[8],
      this.model_view_matrix[9],
      this.model_view_matrix[10]
    ];
    return math.vec3.normalize(out, out);
  }

  set position(vec) {
    const offset = [];
    math.vec3.subtract(offset, vec, this.position);
    math.mat4.translate(
      this.model_view_matrix, this.model_view_matrix, offset
    );
  }

  get position() {
    return [
      this.model_view_matrix[12],
      this.model_view_matrix[13],
      this.model_view_matrix[14]
    ];
  }

  set scale(vec) {
    math.mat4.scale(
      this.model_view_matrix, this.model_view_matrix, vec
    );
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals)
    }
  }

  get_view_matrix() {
    const out = math.mat4.create();
    const look_at_vect = [];
    math.vec3.add(look_at_vect, this.position, this.forward);
    math.mat4.look_at(out, this.position, look_at_vect, this.up);
    return out;
  }

  rotate_along(vec, rad) {
    const rotation_matrix = math.mat4.create();
    math.mat4.from_rotation(rotation_matrix, rad, vec);
    math.mat4.multiply(
      this.model_view_matrix, this.model_view_matrix, rotation_matrix
    );
  }

  rotate_rl(rad) {
    this.rotate_along(math.vec3.from_values(0, 0, 1), rad);
  }

  rotate_ud(rad) {
    this.rotate_along(math.vec3.from_values(1, 0, 0), rad);
  }

  move_along(vec, dist) {
    const move = zero_vector.slice();
    math.vec3.scale(move, vec, dist);
    math.mat4.translate(this.model_view_matrix, this.model_view_matrix, move);
  }

  move_r(dist) {
    this.move_along(math.vec3.from_values(1, 0, 0), dist);
  }

  move_f(dist) {
    this.move_along(math.vec3.from_values(0, 1, 0), dist);
  }

  move_u(dist) {
    this.move_along(math.vec3.from_values(0, 0, 1), dist);
  }

  do_step(tick_length) {
    if (this.dir.f && !this.dir.b) {
      this.move_f(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.b && !this.dir.f) {
      this.move_f(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.r && !this.dir.l) {
      this.move_r(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.l && !this.dir.r) {
      this.move_r(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.u && !this.dir.d) {
      this.move_u(tick_length / 1000 * this.move_speed);
    }

    if (this.dir.d && !this.dir.u) {
      this.move_u(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.r_r && !this.dir.r_l) {
      this.rotate_rl(-tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_l && !this.dir.r_r) {
      this.rotate_rl(tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_u && !this.dir.r_d) {
      this.rotate_ud(tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_d && !this.dir.r_u) {
      this.rotate_ud(-tick_length / 1000 * this.rotate_speed);
    }
  }

  update(tick_length) {
    if (this.skip) {
      return;
    }

    if (this.keyboard_controlled && this.game) {
      Object.keys(this.dir_desc).forEach((key) => {
        if (this.dir_desc[key]) {
          this.dir[this.dir_desc[key]] = this.game.keys[key] || false;
        }
      });
      this.do_step(tick_length);
    }

    if (!this.material) {
      return;
    }

    const model_view_matrix_from = (this.parent && this.parent.model_view_matrix)
      || math.mat4.create();

    // math.mat4.multiply(this.model_view_matrix, this.model_view_matrix, model_view_matrix_from);

    this.color_vec = [...this.color, this.color_opacity];
  }

  render() {
    !this.skip && this.material && this.material_desc.render(this);
  }

  // generate_shadow_map() {
  //   this.material_desc.generate_shadow_map && this.material_desc.generate_shadow_map(this);
  // }
}

export { Entity }
