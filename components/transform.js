import { Component } from '../core/component';
import { vec3, mat4, quat } from '../math';

const default_options = {
  _scale: vec3.unit.slice(),
  _rotation: quat.create(),

  scale: vec3.unit.slice(),
  position: vec3.zero.slice(),
  rotation: quat.create()
}

export class Transform extends Component {
  constructor(options) {
    super(Object.assign({
      matrix: mat4.create(),
      world_matrix: mat4.create(),
      world_to_self: mat4.create()
    },  default_options, options));

    Object.assign(this,  default_options, options);
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

  look_at(target_position) {
    // Find the direction we're looking at. target_position must be given in
    // the current entity's coordinate space.  Use target's world_matrix and
    // the current entity's world_to_self to go from target's space to the
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

  // XXX Add a relative_to attribute for interpreting the translation in spaces
  // other than the local space (relative to the parent).
  translate(vec) {
    const movement = vec3.zero.slice();
    vec3.add(movement, this.position, vec);
    this.position = movement;
  }

  get_view_matrix(out) {
    const look_at_vect = [];
    vec3.add(look_at_vect, this.position, this.forward);
    mat4.look_at(out, this.position, look_at_vect, this.up);
    return out;
  }

  update() {
    if (this.entity.parent) {
      mat4.multiply(
        this.world_matrix,
        this.entity.parent.get_component(Transform).world_matrix,
        this.matrix
      );
    } else {
      this.world_matrix = this.matrix.slice();
    }

    mat4.invert(this.world_to_self, this.world_matrix);
  }
}
