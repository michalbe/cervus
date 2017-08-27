import { create_float_buffer, create_index_buffer } from './context.js';
import { math } from './math.js';
import { zero_vector, unit_vector } from '../misc/defaults.js';
import { hex_to_vec } from '../misc/utils.js';

class Entity {
  constructor(options = {}) {
    this.matrix = math.mat4.create();
    this.world_matrix = math.mat4.create();
    this.world_to_local = math.mat4.create();

    this._scale = unit_vector.slice();
    this._rotation = math.quat.create();

    this.scale = options.scale || unit_vector.slice();
    this.position = options.position || zero_vector.slice();
    this.rotation = options.rotation || math.quat.create();

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

  get up() {
    const out = this.matrix.slice(4, 7);
    return math.vec3.normalize(out, out);
  }

  get forward() {
    const out = this.matrix.slice(8, 11);
    return math.vec3.normalize(out, out);
  }

  set position(vec) {
    math.mat4.compose(this.matrix, this.rotation, vec, this.scale);
  }

  get position() {
    return this.matrix.slice(12, 15);
  }

  set scale(vec) {
    this._scale = vec;
    math.mat4.compose(this.matrix, this.rotation, this.position, vec);
  }

  get scale() {
    return this._scale;
  }

  set rotation(quaternion) {
    this._rotation = quaternion;
    math.mat4.compose(this.matrix, quaternion, this.position, this.scale);
  }

  get rotation() {
    return this._rotation;
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

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world_matrix and
    // the current entity's world_to_local to go from target's space to the
    // current entity space.
    const forward = zero_vector.slice();
    math.vec3.subtract(forward, target_position, this.position);
    math.vec3.normalize(forward, forward);

    // Assume that the world's horizontal plane is the frame of reference for
    // the look_at rotations. This should be fine for most game cameras which
    // don't need to roll.

    // Find left by projecting forward onto the world's horizontal plane and
    // rotating it 90 degress counter-clockwise.
    const left = math.vec3.from_values(forward[0], 0, forward[2]);
    const rot = math.mat4.create();
    math.mat4.rotate(rot, rot, Math.PI/2, [0, 1, 0]);
    math.vec3.transform_mat4(left, left, rot);
    math.vec3.normalize(left, left);

    // Find up by computing the cross-product of forward and left according to
    // the right-hand rule.
    const up = zero_vector.slice();
    math.vec3.cross(up, forward, left);

    // Create a quaternion out of the three axes. The vectors represent axes:
    // they are perpenticular and normalized.
    const rotation = math.quat.create();
    math.quat.set_axes(rotation, left, up, forward);

    this.rotation = rotation;
  }

  rotate_along(vec, rad) {
    const rotation = math.quat.create();
    math.quat.set_axis_angle(rotation, vec, rad);

    // Quaternion multiplication: A * B applies the A rotation first, B second,
    // relative to the coordinate system resulting from A.
    math.quat.multiply(rotation, this.rotation, rotation);
    this.rotation = rotation;
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
    math.mat4.translate(this.matrix, this.matrix, move);
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

    if (this.parent) {
      math.mat4.multiply(
        this.world_matrix, this.parent.world_matrix, this.matrix
      );
    } else {
      this.world_matrix = this.matrix.slice();
    }

    math.mat4.invert(this.world_to_local, this.world_matrix);

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
