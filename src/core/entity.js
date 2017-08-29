import { create_float_buffer, create_index_buffer } from './context';
import { vec3, mat4, quat } from './math';
import { hex_to_vec } from '../utils';

// When using arrow keys for rotation simulate the mouse delta of this value.
const KEY_ROTATION_DELTA = 3;

const default_options = {
  scale: vec3.unit.slice(),
  position: vec3.zero.slice(),
  rotation: quat.create(),

  keyboard_controlled: false,
  mouse_controlled: false,

  move_speed: 3.5,
  rotate_speed: .5,

  dir_desc: {
    87: 'f',
    65: 'l',
    68: 'r',
    83: 'b',
    69: 'u',
    81: 'd',
    38: 'pu',
    40: 'pd',
    39: 'yr',
    37: 'yl'
  },

  skip: false,
};

class Entity {
  constructor(options) {
    this.matrix = mat4.create();
    this.world_matrix = mat4.create();
    this.world_to_local = mat4.create();

    this._scale = vec3.unit.slice();
    this._rotation = quat.create();

    Object.assign(this, default_options, options);

    if (this.material) {
      this.color_vec = [];
      this.color_opacity = 1.0;
      this.color = options.color || '#ffffff';
    }

    this.entities = [];

    this.program = this.material && this.material.program;

    if (this.vertices && this.indices && this.normals) {
      this.create_buffers();
    }
  }

  get up() {
    const out = this.matrix.slice(4, 7);
    return vec3.normalize(out, out);
  }

  get forward() {
    const out = this.matrix.slice(8, 11);
    return vec3.normalize(out, out);
  }

  set position(vec) {
    mat4.compose(this.matrix, this.rotation, vec, this.scale);
  }

  get position() {
    return this.matrix.slice(12, 15);
  }

  set scale(vec) {
    this._scale = vec;
    mat4.compose(this.matrix, this.rotation, this.position, vec);
  }

  get scale() {
    return this._scale;
  }

  set rotation(quaternion) {
    this._rotation = quaternion;
    mat4.compose(this.matrix, quaternion, this.position, this.scale);
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
    vec3.add(look_at_vect, this.position, this.forward);
    mat4.look_at(out, this.position, look_at_vect, this.up);
    return out;
  }

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world_matrix and
    // the current entity's world_to_local to go from target's space to the
    // current entity space.
    const forward = vec3.zero.slice();
    vec3.subtract(forward, target_position, this.position);
    vec3.normalize(forward, forward);

    // Assume that the world's horizontal plane is the frame of reference for
    // the look_at rotations. This should be fine for most game cameras which
    // don't need to roll.

    // Find left by projecting forward onto the world's horizontal plane and
    // rotating it 90 degress counter-clockwise. For any (x, y, z), the rotated
    // vector is (z, y, -x).
    const left = vec3.of(forward[2], 0, -forward[0]);
    vec3.normalize(left, left);

    // Find up by computing the cross-product of forward and left according to
    // the right-hand rule.
    const up = vec3.zero.slice();
    vec3.cross(up, forward, left);

    // Create a quaternion out of the three axes. The vectors represent axes:
    // they are perpenticular and normalized.
    const rotation = quat.create();
    quat.set_axes(rotation, left, up, forward);

    this.rotation = rotation;
  }

  rotate_along(vec, rad) {
    const rotation = quat.create();
    quat.set_axis_angle(rotation, vec, rad);

    // Quaternion multiplication: A * B applies the A rotation first, B second,
    // relative to the coordinate system resulting from A.
    quat.multiply(rotation, this.rotation, rotation);
    this.rotation = rotation;
  }

  rotate_rl(rad) {
    this.rotate_along(vec3.up, rad);
  }

  rotate_ud(rad) {
    this.rotate_along(vec3.left, rad);
  }

  move_along(vec, dist) {
    const move = vec3.zero.slice();
    vec3.scale(move, vec, dist);
    mat4.translate(this.matrix, this.matrix, move);
  }

  handle_keys(tick_length, {f, b, l, r, u, d, pu, pd, yl, yr}) {
    const dist = tick_length / 1000 * this.move_speed;

    if (f) {
      this.move_along(vec3.forward, dist);
    }

    if (b) {
      this.move_along(vec3.forward, -dist);
    }

    if (l) {
      this.move_along(vec3.left, dist);
    }

    if (r) {
      this.move_along(vec3.left, -dist);
    }

    if (u) {
      this.move_along(vec3.up, dist);
    }

    if (d) {
      this.move_along(vec3.up, -dist);
    }

    // Simulate mouse deltas for rotation.
    const mouse_delta = {
      x: (yl ? KEY_ROTATION_DELTA : 0) - (yr ? KEY_ROTATION_DELTA : 0),
      y: (pu ? KEY_ROTATION_DELTA : 0) - (pd ? KEY_ROTATION_DELTA : 0),
    };

    this.handle_mouse(tick_length, mouse_delta);
  }

  handle_mouse(tick_length, mouse_delta) {
    const time_delta = tick_length / 1000;
    const azimuth = this.rotate_speed * time_delta * mouse_delta.x;
    const polar = this.rotate_speed * time_delta * mouse_delta.y;

    // Check if there's any rotation to handle.
    if (azimuth == 0 && polar == 0) {
      return;
    }

    // Polar (with the zenith being the Y axis) to Cartesian, but polar is
    // counted from Z to Y rather than from Y to Z, so we swap cos(polar) for
    // sin(polar) and vice versa.
    const forward = vec3.of(
      Math.cos(polar) * Math.sin(azimuth),
      Math.sin(polar),
      Math.cos(polar) * Math.cos(azimuth)
    );
    vec3.normalize(forward, forward);
    // Transform forward to the object's local coordinate space (relative to
    // the parent).
    vec3.transform_mat4(forward, forward, this.matrix);
    this.look_at(forward);
  }

  update(tick_length) {
    if (this.skip) {
      return;
    }

    if (this.keyboard_controlled && this.game) {
      const current_dirs = {};

      for (const [key_code, dir] of Object.entries(this.dir_desc)) {
        current_dirs[dir] = this.game.keys[key_code];
      }

      this.handle_keys(tick_length, current_dirs);
    }

    if (this.mouse_controlled && this.game) {
      this.handle_mouse(tick_length, this.game.mouse_delta);
    }

    if (this.parent) {
      mat4.multiply(
        this.world_matrix, this.parent.world_matrix, this.matrix
      );
    } else {
      this.world_matrix = this.matrix.slice();
    }

    mat4.invert(this.world_to_local, this.world_matrix);

    this.entities.forEach(entity => entity.update(tick_length));
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
