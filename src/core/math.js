const V = Float32Array;

import {
  normalize,
  subtract,
  add,
  scale,
  transformMat4,
  cross,
  lerp
} from 'gl-matrix/src/gl-matrix/vec3';


import {
  create,
  invert,
  perspective,
  multiply,
  translate,
  fromRotationTranslationScale,
  lookAt
} from 'gl-matrix/src/gl-matrix/mat4';

import {
  create as quat_create,
  multiply as quat_multiply,
  setAxisAngle,
  fromMat3,
  normalize as quat_normalize
} from 'gl-matrix/src/gl-matrix/quat';

export const vec3 = {
  zero: V.of(0, 0, 0),
  unit: V.of(1, 1, 1),
  left: V.of(1, 0, 0),
  up: V.of(0, 1, 0),
  forward: V.of(0, 0, 1),
  of: (...vals) => V.of(...vals),
  normalize,
  subtract,
  add,
  scale,
  transform_mat4: transformMat4,
  cross,
  lerp
};

export const mat4 = {
  create,
  invert,
  perspective,
  multiply,
  translate,
  compose: fromRotationTranslationScale,
  look_at: lookAt,
};

export const quat = {
  create: quat_create,
  multiply: quat_multiply,
  set_axes,
  set_axis_angle: setAxisAngle,
};

export function to_radian(a) {
  return a * Math.PI / 180;
}

// XXX gl-matrix has a bug in quat.setAxes:
// https://github.com/toji/gl-matrix/issues/234
// The following implementation changes the order of axes to match our
// interpretation.
function set_axes(out, left, up, forward) {
  const matrix = Float32Array.of(...left, ...up, ...forward);
  return quat_normalize(out, fromMat3(out, matrix));
}
