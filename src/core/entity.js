import { create_float_buffer, create_index_buffer } from './context.js';
import { math } from './math.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { hex_to_vec } from '../misc/utils.js';

class Entity {
  constructor(options = {}) {
    this.local_matrix = math.mat4.create();
    this.world_matrix = math.mat4.create();

    this.position = options.position || zero_vector.slice();
    this.scale = options.scale || unit_vector.slice();
    this.origin = options.origin || zero_vector.slice();

    this.material = options.material;

    if (this.material) {
      this.color_vec = [];
      this.color_opacity = 1.0;
      this.color = options.color || '#ffffff';
    }

    this.entities = [];

    this.keyboard_controlled = false;

    this.move_speed = 3.5;
    this.rotate_speed = 1.5;

    this.indices = this.indices || options.indices;
    this.vertices = this.vertices || options.vertices;
    this.normals = this.normals || options.normals;

    this.program = this.material && this.material.program;

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
    math.mat4.target_to(this.local_matrix, this.position, vec, up);
  }

  get left() {
    const out = this.local_matrix.slice(0, 3);
    return math.vec3.normalize(out, out);
  }

  get up() {
    const out = this.local_matrix.slice(4, 7);
    return math.vec3.normalize(out, out);
  }

  get forward() {
    const out = this.local_matrix.slice(8, 11);
    return math.vec3.normalize(out, out);
  }

  set position(vec) {
    const offset = [];
    math.vec3.subtract(offset, vec, this.position);
    math.mat4.translate(this.local_matrix, this.local_matrix, offset);
  }

  get position() {
    return this.local_matrix.slice(12, 15);
  }

  set scale(vec) {
    math.mat4.scale(this.local_matrix, this.local_matrix, vec);
  }

  set color(hex) {
    this._color = hex || '#ffffff';
    this.color_vec = [...hex_to_vec(this._color), this.color_opacity];
  }

  get color() {
    return this._color;
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals)
    }
  }

  add(entity) {
    entity.parent = this;
    this.entities.push(entity);
  }

  get_view_matrix(out) {
    const look_at_vect = [];
    math.vec3.add(look_at_vect, this.position, this.forward);
    math.mat4.look_at(out, this.position, look_at_vect, this.up);
    return out;
  }

  rotate_along(vec, rad) {
    // Negate the origin vector so that we can go back.
    const reverse_origin = this.origin.map(i => -i);
    const rotation_matrix = math.mat4.create();
    math.mat4.from_rotation(rotation_matrix, rad, vec);
    math.mat4.translate(this.local_matrix, this.local_matrix, this.origin);
    math.mat4.multiply(this.local_matrix, this.local_matrix, rotation_matrix);
    math.mat4.translate(this.local_matrix, this.local_matrix, reverse_origin);
  }

  rotate_rl(rad) {
    this.rotate_along(math.vec3.from_values(0, 1, 0), rad);
  }

  rotate_ud(rad) {
    this.rotate_along(math.vec3.from_values(1, 0, 0), rad);
  }

  move_along(vec, dist) {
    const move = zero_vector.slice();
    math.vec3.scale(move, vec, dist);
    math.mat4.translate(this.local_matrix, this.local_matrix, move);
  }

  move_r(dist) {
    this.move_along(math.vec3.from_values(1, 0, 0), dist);
  }

  move_u(dist) {
    this.move_along(math.vec3.from_values(0, 1, 0), dist);
  }

  move_f(dist) {
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
      this.move_r(-tick_length / 1000 * this.move_speed);
    }

    if (this.dir.l && !this.dir.r) {
      this.move_r(tick_length / 1000 * this.move_speed);
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
      this.rotate_ud(-tick_length / 1000 * this.rotate_speed);
    }

    if (this.dir.r_d && !this.dir.r_u) {
      this.rotate_ud(tick_length / 1000 * this.rotate_speed);
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

    if (!this.material && !this.entities.length) {
      return;
    }

    if (this.parent) {
      math.mat4.multiply(
        this.world_matrix, this.parent.world_matrix, this.local_matrix
      );
    } else {
      this.world_matrix = this.local_matrix.slice();
    }

    this.entities.forEach(entity => entity.update());
  }

  render(ticks) {
    !this.skip && this.material && this.material.render(this);
    !this.skip && this.entities.forEach((entity) => {
      entity.render(ticks);
    });
  }

  // generate_shadow_map() {
  //   this.material_desc.generate_shadow_map && this.material_desc.generate_shadow_map(this);
  // }
}

export { Entity }
