import { create_float_buffer, create_index_buffer } from './context.js';
import { math } from './math.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { materials } from '../materials/materials.js';

class Entity {
  constructor(options = {}) {
    this.model_view_matrix = math.mat4.identity(math.mat4.create());

    this.position = options.position || zero_vector.slice();
    this.rotation = options.rotation || zero_vector.slice();
    this.scale = options.scale || unit_vector.slice();

    this.material = options.material;

    this.color = options.color || [1.0, 1.0, 1.0];
    this.color_opacity = 1.0;

    this.forward = [];
    this.up = [];
    this.right = [];

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

    const look_at = math.vec3.from_values(-10, -10, -10);
    const up = math.vec3.from_values(0, 0, 1);


    // this.forward = this.get_forward();
    // this.right = this.get_right();
    // this.up = this.get_up();

    math.vec3.subtract(this.forward, look_at, this.position);
    math.vec3.cross(this.right, this.forward, up);
    math.vec3.cross(this.up, this.right, this.forward);

    math.vec3.normalize(this.forward, this.forward);
    math.vec3.normalize(this.right, this.right);
    math.vec3.normalize(this.up, this.up);

    if (this.vertices && this.indices && this.normals) {
      this.create_buffers();
    }
  }

  look_at(vec, up = this.get_up()) {
    // const frustrum_matrix = math.mat4.create();
    // math.mat4.look_at(frustrum_matrix, this.position, vec, up);
    // math.mat4.multiply(this.model_view_matrix, this.model_view_matrix, frustrum_matrix);

    const dir = [];
    math.vec3.subtract(dir, vec, this.position);

    const angle = math.vec3.angle(this.get_forward(), dir);

    const axis = [];
    math.vec3.cross(axis, this.get_forward(), dir);

    math.mat4.rotate(this.model_view_matrix, this.model_view_matrix, angle, axis);
  }

  get_normal(vec) {
    const out = zero_vector.slice();
    math.vec3.transform_mat4(out, vec, this.model_view_matrix);
    return math.vec3.normalize(out, out);
  }

  get_right() {
    return this.get_normal([1, 0, 0]);
  }

  get_forward() {
    return this.get_normal([0, 1, 0]);
  }

  get_up() {
    return this.get_normal([0, 0, 1]);
  }

  create_buffers() {
    this.buffers = {
      vertices: create_float_buffer(this.vertices),
      indices: create_index_buffer(this.indices),
      qty: this.indices.length,
      normals: create_float_buffer(this.normals)
    }
  }

  get_matrix(out) {
    const look_at_vect = [];
    math.vec3.add(look_at_vect, this.position, this.get_forward());
    math.mat4.look_at(out, this.position, look_at_vect, this.get_up());
    return out;
  }

  rotate_along(vec, rad) {
    math.mat4.rotate(this.model_view_matrix, this.model_view_matrix, rad, vec);
  }

  rotate_rl(rad) {
    this.rotate_along(this.get_up(), rad);
  }

  rotate_ud(rad) {
    this.rotate_along(this.get_right(), rad);
  }

  move_f(dist) {
    math.vec3.scale_and_add(this.position, this.position, this.get_forward(), dist);
  }

  move_r(dist) {
    math.vec3.scale_and_add(this.position, this.position, this.get_right(), dist);
  }

  move_u(dist) {
    math.vec3.scale_and_add(this.position, this.position, this.get_up(), dist);
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

    math.mat4.multiply(this.model_view_matrix, this.model_view_matrix, model_view_matrix_from);
    math.mat4.translate(this.model_view_matrix, this.model_view_matrix, this.position);
    math.mat4.scale(this.model_view_matrix, this.model_view_matrix, this.scale);

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
